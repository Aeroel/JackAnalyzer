import fs from "node:fs";
import { Comment_Remover } from "./Comment_Remover.js";
import { Config } from "./Config.js";
import { Tokens_Saver } from "./Tokens_Saver.js";
import { Code_To_Tokens_Converter } from "./Code_To_Tokens_Converter.js";
import { Tokens_To_Tree_Converter } from "./Tokens_To_Tree_Converter.js";

// determines which newline type to use  \r\n (windows) or \n (linux)
Config.set_new_line_type("windows"); 

const provided_path_from_command_line_argument = process.argv[2];
const pathToFileWithoutComments = Comment_Remover.get_code_without_comments_from_file_at_path_and_save_to_a_new_file_in_the_same_directory(provided_path_from_command_line_argument);

const codeWithoutComments = fs.readFileSync(pathToFileWithoutComments, "utf8");
const tokens = Code_To_Tokens_Converter.tokenize(codeWithoutComments);
Tokens_Saver.save_tokens_in_the_same_directory_as_path(tokens, pathToFileWithoutComments);
console.log("done?");

//const tree = Tokens_To_Tree_Converter.tokens_to_tree(tokens);
//Tokens_To_Tree_Converter.save_tree_in_the_same_directory_as_path(tree, pathToFileWithoutComments);


