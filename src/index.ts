#!/usr/bin/env node
import chalk from "chalk";
import figlet from "figlet";
import program from "commander";
import { generateModel } from "./generateModel/generateModel";

// clear();
console.log(
  chalk.red(figlet.textSync("GOI-cli", { horizontalLayout: "full" }))
);

program
  .command("model:new")
  .description("Generates a new Model")
  .action(generateModel);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
program.parse(process.argv);
