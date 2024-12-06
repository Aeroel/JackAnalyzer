import fs from "node:fs";
import { Comment_Remover } from "./Comment_Remover.js";
import { Config } from "./Config.js";
import { Tokens_Saver } from "./Tokens_Saver.js";
import { Tokenizer } from "./Tokenizer.js";

// determines which newline type to use  \r\n (windows) or \n (linux)
Config.set_new_line_type("windows"); 

const provided_path_from_command_line_argument = process.argv[2];
const pathToFileWithoutComments = Comment_Remover.get_code_without_comments_from_file_at_path_and_save_to_a_new_file_in_the_same_directory(provided_path_from_command_line_argument);

const codeWithoutComments = fs.readFileSync(pathToFileWithoutComments, "utf8");
const tokens = Tokenizer.tokenize(codeWithoutComments);
Tokens_Saver.save_tokens_in_the_same_directory_as_path(tokens, pathToFileWithoutComments);
console.log("done?");


