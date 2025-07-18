import * as vscode from "vscode";
import * as cmd from "./commands";
import * as utils from "./utils";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.openFlowInBuilder",
      cmd.openFlowInBuilder
    ),
    vscode.commands.registerCommand(
      "extension.openFlowInRunMode",
      cmd.openFlowInRunMode
    ),
    vscode.commands.registerCommand(
      "extension.openCurrentFlowFileInBuilder",
      cmd.openCurrentFlowFileInBuilder
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
