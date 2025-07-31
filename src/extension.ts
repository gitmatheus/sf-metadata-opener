import * as vscode from "vscode";
import { Properties } from "./properties";
import {bot, flow, report, dashboard, validationRule} from "./openers";
import { clearMetadataCache, displayMetadataCache } from "./salesforce/data/cache";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const botHandlers = bot.registerHandlers(context);
  const flowHandlers = flow.registerHandlers(context);
  const reportHandlers = report.registerHandlers(context);
  const dashboardHandlers = dashboard.registerHandlers(context);
  const validationRuleHandlers = validationRule.registerHandlers(context);

  // Openers commands per module
  const modules = [
    { name: "Bot", handlers: bot.registerHandlers(context) },
    { name: "Flow", handlers: flow.registerHandlers(context) },
    { name: "Report", handlers: report.registerHandlers(context) },
    { name: "Dashboard", handlers: dashboard.registerHandlers(context) },
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
