export { Helper_Functions };
import { Config } from "./Config.js";
class Helper_Functions {
    static newlines = {linux: '\n', "windows": '\r\n'}
    static getNewline(desiredType = false) {
        if(desiredType !== false) {
            return this.newlines[desiredType];
        }
        return this.newlines[Config.new_line_type];
    }
}