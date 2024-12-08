export { Tokens_To_Tree_Converter };
import fs from 'node:fs';

class Tokens_To_Tree_Converter {
    static tokens;
    static treeXML = '';
    static tokenizer;
    static save_tree_XML_in_same_dir_as_path(treeXML, filePath) {
        fs.writeFileSync((filePath + ".tree"), treeXML);
    }

    static parse_tokens_into_tree_XML(tokens) {
        this.tokens = tokens;
        this.compile_class();
    }
    static compile_class() {

        this.xml += `<class>`;

        this.consume("class");
        this.compile_identifier();
        this.consume("{");
        this.compile_class_var_decs();
        this.compile_class_subroutine_decs();
        this.consume("}");

        this.xml += `</class>`;



    }
    static compile_class_subroutine_decs() {
        let subroutine_decs_left_to_process;
        let token_is_constructor_or_function_or_method;


        while (subroutine_decs_left_to_process) {
            this.compile_class_subroutine_dec();

            token_is_constructor_or_function_or_method = Boolean(["constructor", "method", "function"].includes(this.tokenizer.tokenValue()));

            subroutine_decs_left_to_process = Boolean(token_is_constructor_or_function_or_method);
        }
    }
    static compile_class_subroutine_dec() {
        this.xml += `<subroutineDec>`;
        this.compile_constructor_or_function_or_method();
        this.compile_subroutine_return_type(); // 
        this.compile_identifier();
        this.consume('(');
        this.compile_parameter_list();
        this.consume(')');
        this.compile_subroutine_body();

        this.tokenizer.advance();
        this.xml += `</subroutineDec>`;
    }
    static compile_subroutine_body() {
        this.consume('{');
        this.compile_var_decs("subroutineBodyVarDec");
        this.compile_statements();
        this.consume('}');
    }
    static compile_statements() {
        this.xml += `<statements>`;
        const possibleStatements = ["let", "if", "while", "do", "return"];
        let isAStatement;
        let statements_left_to_process;
        function prepare_for_next_iteration() {
            isAStatement = Boolean(possibleStatements.includes(this.tokenizer.tokenValue()));
            statements_left_to_process = Boolean(isAStatement);
        }
        prepare_for_next_iteration();
        while (statements_left_to_process) {
            this.compile_statement();
            prepare_for_next_iteration();
        }
        this.xml += `</statements>`;

    }
    static compile_statement() {
        const statement_type = this.tokenizer.tokenValue();
        const function_name_of_statement_compiler = `compile_${statement_type}_statement`;
        // call the function based on dynamic name
        this[function_name_of_statement_compiler]();
    }
    static compile_let_statement() {
        this.appendToXML(`<letStatement>`);
        this.consume('let');
        this.compile_var_name();
        const squareBracketsNotationPresent = Boolean(this.tokenizer.nextTokenValue() === '[');
        if (squareBracketsNotationPresent) {
            this.consume('[');
            this.compile_expression();
            this.consume(']');
        }
        this.consume('=');
        this.compile_expression();
        this.consume(';');
        this.appendToXML(`</letStatement>`);
    }
    static compile_if_statement() {

    }
    static compile_while_statement() {

    }
    static compile_do_statement() {

    }
    static compile_return_statement() {

    }
    static appendToXML(str) {
        this.xml += str;
    }
    static compile_expression() {
        this.appendToXML(`<expression>`);
        this.compile_term();
        this.appendToXML(`</expression>`);
    }

    static compile_term() {
        this.appendToXML(`<term>`);
        handleTermBasedOnType();

        const term_handler_func_name = `${termType}TermHandler`;
        this[term_handler_func_name]();

        this.appendToXML(`</term>`);


    }
    static varWithArrTermHandler() {
        this.compile_identifier();
        this.consume('[');
        this.compile_expression();
        this.consume(']');
    }
    static subroutineCallTermHandler() {
        this.compile_identifier();
        this.consume('(');
        this.consume(')');

    }
    static isObjOrStaticCallTermHandler() {
        this.compile_identifier(); // class or obj var name
        this.consume('.');
        this.compile_identifier(); // method or static func name
        this.consume('(');
        this.compile_expression_list();
        this.consume(')');

    }
    static compile_expressions() {
        this.appendToXML(`<expressionList>`);
        let anyMoreExpressionToProcess = Boolean();
        function prepare_for_next_iteration() {

        }
        this.appendToXML(`</expressionList>`);
    }
    static handleTermBasedOnType() {
        let isIntConst, isStrConst, isKeywordConst, isVarNameWithArrayAccess, isObjMethodOrStaticFuncCall, isSubroutineCall, isJustVarName, isUnaryOp;

        isIntConst = Boolean(this.tokenizer.tokenType() === 'integerConstant');

        isStrConst = Boolean(this.tokenizer.tokenType() === 'stringConstant');

        const tokValMatchesAKeyword = Boolean(["true", "false", "null", "this"].includes(this.tokenizer.tokenValue()));

        isKeywordConst = Boolean(!isStrConst && tokValMatchesAKeyword);

        const nextTokenValue = this.tokenizer.nextTokenValue();

        isVarNameWithArrayAccess = Boolean(nextTokenValue === '[');

        isObjMethodOrStaticFuncCall = Boolean(nextTokenValue === '.');
        isSubroutineCall = Boolean(nextTokenValue === '(');
        isJustVarName = Boolean(!(isVarNameWithArrayAccess || isObjMethodOrStaticFuncCall || isSubroutineCall));

        const tokenValueIsUnaryOp = Boolean(["~", "-"].includes(this.tokenizer.tokenValue()));
        isUnaryOp = Boolean(tokenValueIsUnaryOp);

        if (isIntConst || isStrConst || isKeywordConst) {
            return this.compile_token_type_and_value();

        } else if (isVarNameWithArrayAccess) {
            return this.varWithArrTermHandler();
        } else if (isObjMethodOrStaticFuncCall) {
            return this.isObjOrStaticCallTermHandler();
        } else if (isSubroutineCall) {
            return this.subroutineCallTermHandler();
        } else if (isJustVarName) {
            return this.compile_identifier();
        } else if (isUnaryOp) {
            return this.unaryOpTermHandler();
        } else {
            throw new Error(`Determine term type error, none of conds is true`);
        }

    }
    static compile_constructor_or_function_or_method() {
        this.xml += this.next_token_xml();
        this.tokenizer.advance();
    }
    static next_token_xml() {
        return `<${this.tokenizer.tokenType()}> ${this.tokenizer.tokenValue()} </${this.tokenizer.tokenType()}>`;
    }
    static compile_field_or_static_keyword() {
        const fieldOrStaticXML = this.next_token_xml();
        this.xml += fieldOrStaticXML;
        this.tokenizer.advance();
    }
    static compile_token_type_and_value() {
        const varTypeXML = `<${this.tokenizer.tokenType()}> ${this.tokenizer.tokenValue()} </${this.tokenizer.tokenType()}>`;
        this.xml += varTypeXML;
        this.tokenizer.advance();
    }
    static compile_var_decs(decType) {
        // a subroutine body var dec is called just var dec in xml rule and I am too lazy to make the xml name distinction separate 
        if (decType === "subroutineBodyVarDec") {
            decType = "varDec";
        }
        const decTypeIsValid = Boolean(decType === 'varDec' || decType === 'classVarDec');
        if (!decTypeIsValid) {
            throw new Error(`Compile var decs: decType expected to be varDec or classVarDec, but received ${decType} instead`);
        }
        let varDecsLeftToProcess;
        function prepare_for_next_iteration() {
            switch (decType) {
                case "classVarDec":
                    varDecsLeftToProcess = Boolean(this.tokenizer.tokenValue() === 'field' || this.tokenizer.tokenValue() === 'static');
                    break;
                case "varDec":
                    varDecsLeftToProcess = Boolean(this.tokenizer.tokenValue() === 'var');
                    break;
            }
        }

        prepare_for_next_iteration();

        while (varDecsLeftToProcess) {
            this.compile_class_var_dec(decType);
            prepare_for_next_iteration();

        }

    }
    static compile_class_var_dec(decType) {
        this.xml += `<${decType}>`;

        switch (decType) {
            case "classVarDec":
                this.compile_field_or_static_keyword();
                break;
            case "varDec":
                this.consume('var');
                break;
        }

        this.compile_token_type_and_value();

        this.compile_identifier();

        let we_have_more_comma_separated_vars_of_same_type_here_declared = Boolean(this.tokenizer.tokenValue() === ',');

        while (we_have_more_comma_separated_vars_of_same_type_here_declared) {
            this.consume(',');
            this.compile_identifier();

            we_have_more_comma_separated_vars_of_same_type_here_declared = Boolean(this.tokenizer.tokenValue() === ',');
        }
        this.consume(';');

        this.xml += `</${decType}>`;
        this.tokenizer.advance();
    }
    static consume(requiredValue) {
        const tokenValue = this.tokenizer.tokenValue();
        const tokenType = this.tokenizer.tokenType();
        if (!tokenValue === requiredValue) {
            throw new Error(`Expected the required token value ${requiredValue}, but the actual token has a  different value (${tokenValue})`);
        }
        this.xml += `<${tokenType}> ${tokenValue} </${tokenType}>`;
        this.tokenizer.advance();

    }

    static compile_identifier() {

        this.xml += `<identifier> ${this.tokenizer.identifierValue()} </identifier>`;

        this.tokenizer.advance();

    }

    static compile_subroutine_return_type() {
        this.compile_token_type_and_value();
    }
    static compile_var_name() {
        this.compile_identifier();
    }

}