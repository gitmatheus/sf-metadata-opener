import * as vscode from "vscode";
import { Properties } from "./properties";
import {bot, dashboard, flexipage, flow, report, sobject, validationRule} from "./openers";
import { clearMetadataCache, displayMetadataCache } from "./salesforce/data/cache";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Openers commands per module
  const modules = [
    { name: "Bot", handlers: bot.registerHandlers(context) },
    { name: "Dashboard", handlers: dashboard.registerHandlers(context) },
    { name: "FlexiPage", handlers: flexipage.registerHandlers(context) },
    { name: "Flow", handlers: flow.registerHandlers(context) },
    { name: "Report", handlers: report.registerHandlers(context) },
    { name: "SObject", handlers: sobject.registerHandlers(context) },    
    { name: "ValidationRule", handlers: validationRule.registerHandlers(context) },
  ];

  for (const { name, handlers } of modules) {
    context.subscriptions.push(
      vscode.commands.registerCommand(`extension.open${name}InEditMode`, handlers.openInEditMode),
      vscode.commands.registerCommand(`extension.open${name}InViewMode`, handlers.openInViewMode),
      vscode.commands.registerCommand(`extension.openCurrent${name}InEditMode`, handlers.openFileInEditMode),
      vscode.commands.registerCommand(`extension.openCurrent${name}InViewMode`, handlers.openFileInViewMode),
    );
  }

  // Metadata cache commands
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.clearMetadataCache", async () => {
      try {
        await clearMetadataCache(context);
        vscode.window.showInformationMessage("🧹✨ Metadata cache cleared.");
      } catch (err: any) {
        vscode.window.showErrorMessage(`Error clearing cache: ${err.message}`);
      }
    }),
    vscode.commands.registerCommand("extension.displayMetadataCache", async () => {
      displayMetadataCache(context);
    }),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("SalesforceMetadataOpener")) {
        Properties.refresh();
      }
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
