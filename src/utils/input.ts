import { terminal } from "terminal-kit";

type SelectFromListOutput = {
  selectedIndex: number;
  selectedText: string;
  submitted?: boolean;
  x?: number;
  y?: number;
  canceled?: boolean;
  unexpectedKey?: string;
};

export async function getInput(msg: string): Promise<string> {
  terminal.yellow(msg);
  return terminal.inputField().promise;
}

export async function getBinaryAnswer(msg: string): Promise<boolean> {
  terminal.yellow(msg + " [y|n] : ");
  return terminal.yesOrNo({
    yes: ["y", "ENTER"],
    no: ["n"],
  }).promise;
}

export async function selectFromList(
  list: any[],
  msg: string,
  menuType: "column" | "row" | "grid" = "column"
): Promise<SelectFromListOutput> {
  terminal.yellow(msg + "\n");
  let selectedDbFunction: SelectFromListOutput;
  if (menuType == "column") {
    selectedDbFunction = await terminal.singleColumnMenu(list).promise;
  } else if (menuType == "grid") {
    selectedDbFunction = await terminal.gridMenu(list).promise;
  } else {
    selectedDbFunction = await terminal.singleLineMenu(list).promise;
  }
  terminal("\n").eraseLineAfter.green(
    "#%s selected",
    selectedDbFunction.selectedText
  );
  return selectedDbFunction;
}

export function errorMsg(message: string) {
  terminal.red(message + "\n");
}

export function success(message: string) {
  terminal.green(message + "\n");
}

export function info(message: string) {
  terminal.yellow(message + "\n");
}

export function blueMessage(message: string) {
  terminal.blue(message + "\n");
}
