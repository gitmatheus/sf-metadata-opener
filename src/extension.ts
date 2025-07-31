import * as vscode from "vscode";
import { Properties } from "./properties";
import * as bot from "./commands/bot";
import * as flow from "./commands/flow";
import * as report from "./commands/report";
import * as dashboard from "./commands/dashboard";
import * as validationRule from "./commands/validationRule";
import { clearMetadataCache, displayMetadataCache } from "./salesforce/data/cache";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const botHandlers = bot.registerHandlers(context);
  const flowHandlers = flow.registerHandlers(context);
  const reportHandlers = report.registerHandlers(context);
  const dashboardHandlers = dashboard.registerHandlers(context);
  const validationRuleHandlers = validationRule.registerHandlers(context);

  context.subscriptions.push(
    // Flow commands
    vscode.commands.registerCommand("extension.openFlowInBuilder", flowHandlers.openInEditMode),
    vscode.commands.registerCommand("extension.openFlowInRunMode", flowHandlers.openInRunMode),
    vscode.commands.registerCommand("extension.openCurrentFlowInEditMode", flowHandlers.openFileInEditMode),
    vscode.commands.registerCommand("extension.openCurrentFlowInRunMode", flowHandlers.openFileInRunMode),

    // Bot commands
    vscode.commands.registerCommand("extension.openBotInEditMode", botHandlers.openInEditMode),
    vscode.commands.registerCommand("extension.openBotInViewMode", botHandlers.openInViewMode),
    vscode.commands.registerCommand("extension.openCurrentBotInEditMode", botHandlers.openFileInEditMode),
    vscode.commands.registerCommand("extension.openCurrentBotInViewMode", botHandlers.openFileInViewMode),

    // report commands
    vscode.commands.registerCommand("extension.openReportInEditMode", reportHandlers.openInEditMode),
    vscode.commands.registerCommand("extension.openReportInViewMode", reportHandlers.openInViewMode),
    vscode.commands.registerCommand("extension.openCurrentReportInEditMode", reportHandlers.openFileInEditMode),
    vscode.commands.registerCommand("extension.openCurrentReportInViewMode", reportHandlers.openFileInViewMode),

    // Dashboard commands
    vscode.commands.registerCommand("extension.openDashboardInEditMode", dashboardHandlers.openInEditMode),
    vscode.commands.registerCommand("extension.openDashboardInViewMode", dashboardHandlers.openInViewMode),
    vscode.commands.registerCommand("extension.openCurrentDashboardInEditMode", dashboardHandlers.openFileInEditMode),
    vscode.commands.registerCommand("extension.openCurrentDashboardInViewMode", dashboardHandlers.openFileInViewMode),

    // Validation Rule commands
    vscode.commands.registerCommand("extension.openValidationRuleInEditMode", validationRuleHandlers.openInEditMode),
    vscode.commands.registerCommand("extension.openValidationRuleInViewMode", validationRuleHandlers.openInViewMode),
    vscode.commands.registerCommand("extension.openCurrentValidationRuleInEditMode", validationRuleHandlers.openFileInEditMode),
    vscode.commands.registerCommand("extension.openCurrentValidationRuleInViewMode", validationRuleHandlers.openFileInViewMode),


    // Metadata cache commands
    vscode.commands.registerCommand("extension.clearMetadataCache", async () => {
      try {
        await clearMetadataCache(context);
        vscode.window.showInformationMessage("✅ Metadata cache cleared.");
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
