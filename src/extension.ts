import * as vscode from "vscode";
import { Properties } from "./properties";
import * as BotCommands from "./commands/bot";
import * as FlowCommands from "./commands/flow";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    
    // Flow commands
    vscode.commands.registerCommand(
      "extension.openFlowInBuilder",
      FlowCommands.openInEditMode
    ),

    vscode.commands.registerCommand(
      "extension.openFlowInRunMode",
      FlowCommands.openInRunMode
    ),

    vscode.commands.registerCommand(
      "extension.openCurrentFlowInEditMode",
      FlowCommands.openFileInEditMode
    ),

    vscode.commands.registerCommand(
      "extension.openCurrentFlowInRunMode",
      FlowCommands.openFileInRunMode
    ),

    // Agentforce Agents (Bot) commands
    vscode.commands.registerCommand(
      "extension.openBotInEditMode",
      BotCommands.openInEditMode
    ),
    vscode.commands.registerCommand(
      "extension.openBotInViewMode",
      BotCommands.openInViewMode
    ),
    vscode.commands.registerCommand(
      "extension.openCurrentBotInEditMode",
      BotCommands.openFileInEditMode
    ),
    vscode.commands.registerCommand(
      "extension.openCurrentBotInViewMode",
      BotCommands.openFileInViewMode
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
