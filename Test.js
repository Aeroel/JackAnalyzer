import { Code_To_Tokens_Converter } from "./Code_To_Tokens_Converter.js";
import { Token_Handler_Functions_To_Inject_Into_Tokenizer } from "./Token_Handler_Functions_To_Inject_Into_Tokenizer.js";

const provided_path_from_command_line_argument = process.argv[2];

const tokenHandler = new Token_Handler_Functions_To_Inject_Into_Tokenizer(); 
const tokenizer = new Code_To_Tokens_Converter(provided_path_from_command_line_argument);
tokenHandler.injectInto(tokenizer);