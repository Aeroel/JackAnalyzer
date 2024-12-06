export { Helper_Functions };
import { Config } from "./Config.js";
class Helper_Functions {
    static getNewline() {
        if (Config.new_line_type === "linux") {
            return "\n";
        } else if (Config.new_line_type === "windows") {
            return "\r\n";
        }
    }
}