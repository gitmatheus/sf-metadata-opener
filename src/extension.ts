import * as vscode from "vscode";
import * as cmd from "./commands";
import { Properties } from "./properties";

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
    ),

    vscode.commands.registerCommand(
      "extension.openCurrentFlowFileInRunMode",
      cmd.openCurrentFlowFileInRunMode
    ),

    vscode.commands.registerCommand(
      "extension.openBotInBuilder",
      cmd.openBotInBuilder
    ),
    vscode.commands.registerCommand(
      "extension.openBotInSetup",
      cmd.openBotInSetup
    ),
    vscode.commands.registerCommand(
      "extension.openCurrentBotFileInBuilder",
      cmd.openCurrentBotFileInBuilder
    ),
    vscode.commands.registerCommand(
      "extension.openCurrentBotFileInSetup",
      cmd.openCurrentBotFileInSetup
    ),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("SalesforceMetadataOpener")) {
        Properties.refresh();
      }
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
