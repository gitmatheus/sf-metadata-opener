import * as vscode from "vscode";
import { Properties } from "./properties";
import * as bot from "./commands/bot";
import * as flow from "./commands/flow";
import * as report from "./commands/report";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // Flow commands
    vscode.commands.registerCommand("extension.openFlowInBuilder", flow.openInEditMode),
    vscode.commands.registerCommand("extension.openFlowInRunMode", flow.openInRunMode),
    vscode.commands.registerCommand("extension.openCurrentFlowInEditMode", flow.openFileInEditMode),
    vscode.commands.registerCommand("extension.openCurrentFlowInRunMode", flow.openFileInRunMode),

    // Bot commands
    vscode.commands.registerCommand("extension.openBotInEditMode", bot.openInEditMode),
    vscode.commands.registerCommand("extension.openBotInViewMode", bot.openInViewMode),
    vscode.commands.registerCommand("extension.openCurrentBotInEditMode", bot.openFileInEditMode),
    vscode.commands.registerCommand("extension.openCurrentBotInViewMode", bot.openFileInViewMode),

    // report commands
    vscode.commands.registerCommand("extension.openBotInEditMode", report.openInEditMode),
    vscode.commands.registerCommand("extension.openBotInViewMode", report.openInViewMode),
    vscode.commands.registerCommand("extension.openCurrentBotInEditMode", report.openFileInEditMode),
    vscode.commands.registerCommand("extension.openCurrentBotInViewMode", report.openFileInViewMode),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("SalesforceMetadataOpener")) {
        Properties.refresh();
      }
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
