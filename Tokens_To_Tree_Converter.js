export { Tokens_To_Tree_Converter };
import fs from 'node:fs';

class Tokens_To_Tree_Converter {
    static tokens;
    static treeXML = '';
    static save_tree_XML_in_same_dir_as_path(treeXML, filePath) {
        fs.writeFileSync((filePath + ".tree"), treeXML);
    }

    static parse_tokens_into_tree_XML(tokens) {
        this.tokens = tokens;
        this.compile_class();
    }
    static compile_class() {

        this.xml += `<class>`;

        this.token_value_here_required_to_be("class");
        this.compile_class_name();
        this.token_value_here_required_to_be("{");
        this.compile_class_var_dec();
        this.compile_class_subroutine_dec();
        this.token_value_here_required_to_be("}");

        this.xml += `</class>`;



    }
    static token_value_here_required_to_be(requiredValue) {
        const tokenValue = this.tokenizer.tokenValue();
        const tokenType = this.tokenizer.tokenType()
        if (!tokenValue === requiredValue) {
            throw new Error(`Expected the required token value ${requiredValue}, but the actual token has a  different value (${tokenValue})`);
        }
        this.xml += `<${tokenType}> ${tokenValue} </${tokenType}>`;
        this.tokenizer.advance();

    }
    static compile_class_name() {
        this.compile_identifier();
    }
    static compile_identifier() {

        this.xml += `<identifier> ${this.tokenizer.identifierValue()} </identifier>`;

        this.tokenizer.advance();

    }

}