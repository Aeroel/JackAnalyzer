export { Token_Handler_Functions_To_Inject_Into_Tokenizer };
class Token_Handler_Functions_To_Inject_Into_Tokenizer {
    injectInto(tokenizerThis) {
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(method => {
            if (method !== 'constructor') {
                tokenizerThis[method] = this[method].bind(tokenizerThis);
            }
        });
    }
    handleKeyword(index) {
        let isKeyword = false;

        let i_2 = index;
        let keywordIndex = 0;
        let possibleKeyword = '';

        while (this.current_character_matches_a_keyword_character_at_index(this.code[i_2], keywordIndex)) {
            possibleKeyword += this.code[i_2];
            keywordIndex++;
            i_2++;

        }
        if (this.keywords.includes(possibleKeyword)) {
            isKeyword = true;
            this.tokens.push(`<keyword>${possibleKeyword}</keyword>`);
        }

        return isKeyword;
    }
    handleInteger(index) {
        // then it's... either an int, string or identifier
        // first check if it's int
        let possibleInteger = '';
        let start_at = index;
        let iter_count = 1;
        let firstCharIsInteger = false;
        while (Number.isInteger(this.code[start_at])) {
            if (iter_count === 1) {
                firstCharIsInteger = true;
            }
            possibleInteger += this.code[start_at];
            start_at++;
            iter_count++;
        }
        if (possibleInteger.length > 0) {
            this.tokens.push(`<integerConstant>${possibleInteger}</integerConstant>`);
        }
        return firstCharIsInteger;

    }
    handleIdentifier(index) {
        let isIdentifier = false;
        let possibleIdentifier = '';
        while (this.is_number_or_underscore_or_ascii_english_letter(this.code[index])) {
            possibleIdentifier += this.code[index];
            index++;
        }

        if (possibleIdentifier.length > 0) {
            this.tokens.push(`<stringConstant>${possibleIdentifier}</stringConstant>`);
            isIdentifier = true;
        }
        return isIdentifier;
    }
    handleStringConstant(index) {
        let isStringConstant = false;
        if (!(this.code[index] === `"`)) {
            return isStringConstant;
        }
        let possibleStringConstant = '';
        let str_i = index + 1;
        while (str_i !== `"`) {
            possibleStringConstant += this.code[str_i];
            str_i++;
        }
        if (possibleStringConstant.length > 0) {
            this.tokens.push(`<stringConstant>${possibleStringConstant}</stringConstant>`);
            isStringConstant = true;
        }
        return isStringConstant;
    }
    handleSymbol(i) {
        let isSymbol = false;
        if (this.symbols.includes(this.code[i])) {
            this.addSymbol(this.code[i]);
            isSymbol = true;
        }
        return isSymbol;
    }
}