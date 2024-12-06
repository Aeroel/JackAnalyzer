import fs from "node:fs";
import path from "node:path";

export { Code_To_Tokens_Converter };

class Code_To_Tokens_Converter {
    symbols = [
        "{", "}",
        "(", ")",
        "[", "]",
        ".", ",", ";",
        "+", "-", "*", "/",
        "&", "|",
        "<", ">", "=", "~",
    ];
    keywords = [
        "class",
        "constructor", "function", "method",
        "field", "static", "var",
        "int", "char", "boolean",
        "void",
        "true", "false",
        "null",
        "this",
        "let", "do",
        "if", "else",
        "while",
        "return",

    ];
    fileContents;
    code;
    pathToFile;
    constructor(pathToFile) {
        this.pathToFile = pathToFile;
        this.openFile();
        this.removeComments();
        this.write_code_to_file();
    }
    openFile() {
        console.log(`Reading code of a file located at ${this.pathToFile}`);

        this.fileContents = fs.readFileSync(this.pathToFile, 'utf8');
    }
    determine_if_current_character_is_where_this_particular_comment_ends() {
        const currentCharacter = this.fileContents[this.atCharIndexInFileContents];
        const previousCharacter = this.fileContents[this.atCharIndexInFileContents - 1];

        if (this.inSingleLineComment) {
            const windowsStyleComment = ["\r", "\n"];
            const at_this_point_the_single_line_comment_ends = Boolean(
                currentCharacter === '\n'
                ||
                (previousCharacter === windowsStyleComment[0] && currentCharacter === windowsStyleComment[1])
            );
            if (at_this_point_the_single_line_comment_ends) {
                this.inSingleLineComment = false;
            }
        }
        if (this.inMultiLineComment) {
            const at_this_point_the_multiline_comment_ends = Boolean(previousCharacter === '*' && currentCharacter === '/');
            if (at_this_point_the_multiline_comment_ends) {
                this.inMultiLineComment = false;
            }
        }
    }
    prepare_for_next_character() {
        // next iteration we look at next character if there are more characters
        this.atCharIndexInFileContents++;
        this.there_are_more_characters_to_process = Boolean(this.atCharIndexInFileContents < this.fileContents.length);
    }
    removeComments() {
        console.log(`Removing comments from the file code`);
        
        let codeOnly = '';

        this.inSingleLineComment = false;
        this.inMultiLineComment = false;

        this.atCharIndexInFileContents = 0;

        this.there_are_more_characters_to_process = Boolean(this.atCharIndexInFileContents < this.fileContents.length);
        while (this.there_are_more_characters_to_process) {
            console.log(this.fileContents[this.atCharIndexInFileContents]);
            const currentCharacter = this.fileContents[this.atCharIndexInFileContents];
            const nextCharacter = this.fileContents[this.atCharIndexInFileContents + 1];

            const currentlyInAComment = (this.inSingleLineComment || this.inMultiLineComment);

            if (currentlyInAComment) {
                this.determine_if_current_character_is_where_this_particular_comment_ends();
                this.prepare_for_next_character();
                continue;
            }

            this.inSingleLineComment = (currentCharacter === '/' && nextCharacter === '/');
            this.inMultiLineComment = (currentCharacter === '/' && nextCharacter === '*');

            const the_current_character_is_the_beginning_of_a_comment = Boolean(this.inSingleLineComment || this.inMultiLineComment);

            if (the_current_character_is_the_beginning_of_a_comment) {
                // Skip the next '/' or '*'
                this.atCharIndexInFileContents++;
                this.prepare_for_next_character();
                continue;
            }

            codeOnly += currentCharacter;
            this.prepare_for_next_character();
        }

        console.log(codeOnly);
        
        this.code = codeOnly;
    }
    tokenize() {
        const code = this.code;
        this.tokens = [
            "<tokens>"
        ];
        let i = 0;
        while (i < code.length) {
            (
                this.handleSymbol(i)
                || this.handleKeyword(i)
                || this.handleInteger(i)
                || this.handleIdentifier(i)
                || this.handleStringConstant(i)
            );
            i++;
            console.log(i);

        }
        this.tokens.push("</tokens>");
        console.log(`[gotTokens] Got ${this.tokens.length} tokens`);
        console.log("ggg");

        this.tokens = tokens;
    }
    addSymbol(sym) {
        this.tokens.push(`<symbol>${sym}</symbol>`);
    }

    is_number_or_underscore_or_ascii_english_letter(character) {
        const code = character.charCodeAt(0); // Get the Unicode value of the character

        // Check if the character is a letter (A-Z or a-z), a digit (0-9), or an underscore (_)
        return (
            (code >= 65 && code <= 90) || // A-Z
            (code >= 97 && code <= 122) || // a-z
            (code >= 48 && code <= 57) ||  // 0-9
            code === 95                     // _
        );
    }

    current_character_matches_a_keyword_character_at_index(keyword_character_index, character) {
        return this.keywords.some(keyword => keyword[keyword_character_index] === character);
    }
    write_code_to_file() {
        const newFilePath = path.format({
            dir: path.dirname(this.pathToFile), // Get the directory of the input file
            name: path.basename(this.pathToFile, path.extname(this.pathToFile)), // Get the base name without extension
            ext: '.jack.comments_removed' // Set new extension
        });
        console.log(`Writing code without comments to ${newFilePath}`);

        fs.writeFile(newFilePath, this.code, () => { });
    }


}