import fs from "node:fs";
import path from "node:path";
import { Helper_Functions } from "./Helper_Functions.js";

export { Tokens_Saver };

class Tokens_Saver {
    static write_tokens_to_file_in_the_same_directory_as(tokens, pathToFile) {
        this.save_tokens_in_the_same_directory_as_path(tokens,pathToFile);
    }
    static convertTokensToXML(tokens) {
        let xml = '';
        tokens.forEach(token => {
            const openingTag = `<${token.type}>`;
            let value = token.value;
            value = value.replaceAll("<", "&lt;");
            value = value.replaceAll(">", "&gt;");
            const closingTag = `</${token.type}>`;
            const fullTokenXMLForm = `${openingTag} ${value} ${closingTag}${Helper_Functions.getNewline()}`;
            xml += fullTokenXMLForm;
        }); 
        const tokensOpeningTag = "<tokens>" + Helper_Functions.getNewline();
        const tokensClosingTag = "</tokens>" + Helper_Functions.getNewline();
        xml = `${tokensOpeningTag}${xml}${tokensClosingTag}`;
        return xml;
    }
    static save_tokens_in_the_same_directory_as_path(tokens, path) {
        const tokensXML = this.convertTokensToXML(tokens);
        
        const newFilePath = path + ".tokens.xml";
        console.log(`[Tokens_Saver] Saving tokens in XML format on path ${newFilePath} `);
        fs.writeFileSync(newFilePath, tokensXML);
    }

}