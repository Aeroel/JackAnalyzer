export { Tokenizer };
class Tokenizer {
    static symbols = [
        "{", "}",
        "(", ")",
        "[", "]",
        ".", ",", ";",
        "+", "-", "*", "/",
        "&", "|",
        "<", ">", "=", "~",
    ];
    static keywords = [
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
    static tokens = new Array();
    static currentCharIndex = 0;
    static there_are_characters_left_to_process = false;
    static code = '';

    static tokenize(code) {
        this.code = code;
        this.currentCharIndex = 0;
        this.there_are_characters_left_to_process = Boolean(this.currentCharIndex < code.length);
        while (this.there_are_characters_left_to_process) {
            const possible_token_that_starts_at_current_char_index = this.get_token_that_start_from_current_character_index_if_any();

            const aTokenStartingAtCurrentCharFound = Boolean(possible_token_that_starts_at_current_char_index);
            if (!aTokenStartingAtCurrentCharFound) {
                this.prepare_for_next_iteration();
                continue;
            }
            this.tokens.push({
                ...possible_token_that_starts_at_current_char_index
            });
            this.currentCharIndex = possible_token_that_starts_at_current_char_index.lastCharacterIndex;
            this.prepare_for_next_iteration();
        }
        return this.tokens;
    }
    static get_token_that_start_from_current_character_index_if_any() {
        const valueIfNoTokenFound = false;
        const tokenIfAny = this.mightBeASymbol()
            || this.orAnIntegerConstant()
            || this.orAKeyword()
            || this.orAnIdentifier()
            || this.orAStringConstant()
            || valueIfNoTokenFound;

        return tokenIfAny;

    }
    static mightBeASymbol() {
        const currentCharacter = this.code[this.currentCharIndex];
        let token = false;
        let isSymbol = Boolean(this.symbols.includes(currentCharacter));
        if (isSymbol) {
            token = {
                type: "symbol",
                value: currentCharacter,
                lastCharacterIndex: this.currentCharIndex,
            };
        }
        return token;
    }

    static orAnIntegerConstant() {
        let token = false;

        let integerValue = '';
        let localCharIndex = this.currentCharIndex;
        let there_are_numbers_left_to_process = Boolean(Number.isInteger(this.code[localCharIndex]));
        while (there_are_numbers_left_to_process) {
            integerValue += this.code[localCharIndex];

            const nextCharacter = this.code[localCharIndex + 1];
            there_are_numbers_left_to_process = Boolean(Number.isInteger(nextCharacter));
            if (there_are_numbers_left_to_process) {
                localCharIndex++;
            }
        }
        if (integerValue.length > 0) {
            token = {
                type: "integerConstant",
                value: integerValue,
                lastCharacterIndex: localCharIndex
            };
        }
        return token;

    }

    static orAKeyword() {
        let token = false;

        let keywordValue = '';
        let relativeKeywordIndex = 0;

        let localCharIndex = this.currentCharIndex;

        let currentCharacter = this.code[localCharIndex];


        let does_the_character_match_any_keyword_s_character_at_index = Boolean(this.does_character_match_any_keyword_character_at_index(currentCharacter, relativeKeywordIndex));
        while (does_the_character_match_any_keyword_s_character_at_index) {
            keywordValue += currentCharacter;


            const nextCharacter = this.code[localCharIndex + 1];
            const nextRelativeKeywordIndex = relativeKeywordIndex + 1;
            does_the_character_match_any_keyword_s_character_at_index = Boolean(this.does_character_match_any_keyword_character_at_index(nextCharacter, nextRelativeKeywordIndex));
            if (!does_the_character_match_any_keyword_s_character_at_index) {
                break;
            }
            relativeKeywordIndex++;
            localCharIndex++;
            currentCharacter = this.code[localCharIndex];

        }
        if (this.keywords.includes(keywordValue)) {
            token = {
                type: "keyword",
                value: keywordValue,
                lastCharacterIndex: localCharIndex,
            };
        }

        return token;
    }

    static orAnIdentifier() {
        let token = false;

        let identifierValue = '';
        let localCharIndex = this.currentCharIndex;
        let currentCharacter = this.code[localCharIndex];
        let character_is_part_of_identifier = Boolean(this.character_is_number_or_underscore_or_ascii_english_letter(currentCharacter));
        while (character_is_part_of_identifier) {
            identifierValue += currentCharacter;

            const nextCharacter = this.code[localCharIndex + 1];
            const next_character_is_also_part_of_the_identifier = Boolean(this.character_is_number_or_underscore_or_ascii_english_letter(nextCharacter));
            if (!next_character_is_also_part_of_the_identifier) {
                break;
            }
            localCharIndex++;
            currentCharacter = this.code[localCharIndex];
        }

        if (identifierValue.length > 0) {
            token = {
                type: "identifier",
                value: identifierValue,
                lastCharacterIndex: localCharIndex,
            };
        }
        return token;
    }

    static orAStringConstant() {
        let token = false;
        let firstCharacter = this.code[this.currentCharIndex];
        // important to move to next char before the while loop below, otherwise it will try checking if " === " and exit immediately
        this.currentCharIndex++;
        const isAStringConstant = Boolean(firstCharacter === `"`);
        if (!isAStringConstant) {
            return token;
        }

        let stringConstantValue = ``;

        let localCharIndex = this.currentCharIndex;
        let currentCharacter = this.code[localCharIndex];

        while (currentCharacter !== `"`) {
            stringConstantValue += currentCharacter;
            localCharIndex++;
            currentCharacter = this.code[localCharIndex];
        }

        if (stringConstantValue.length > 0) {
            token = {
                type: "stringConstant",
                value: stringConstantValue,
                lastCharacterIndex: localCharIndex,
            };

        }
        return token;
    }


    static prepare_for_next_iteration() {
        this.currentCharIndex++;
        this.there_are_characters_left_to_process = Boolean(this.currentCharIndex < this.code.length);
    }

    static character_is_number_or_underscore_or_ascii_english_letter(character) {
        const code = character.charCodeAt(0); // Get the Unicode value of the character

        // Check if the character is a letter (A-Z or a-z), a digit (0-9), or an underscore (_)
        return (
            (code >= 65 && code <= 90) || // A-Z
            (code >= 97 && code <= 122) || // a-z
            (code >= 48 && code <= 57) ||  // 0-9
            code === 95                     // _
        );
    }

    static does_character_match_any_keyword_character_at_index(character, keyword_character_index) {
        return this.keywords.some(keyword => keyword[keyword_character_index] === character);
    }




}