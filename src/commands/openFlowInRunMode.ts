import * as vscode from "vscode";
import * as sf from "../salesforce";
import * as utils from "../utils";

/**
 * Opens the selected Flow in Run Mode via CLI
 */
export async function openFlowInRunMode(uri: vscode.Uri): Promise<void> {
  try {
    const filePath = uri.fsPath;
    const flowName = utils.parseFlowNameFromFilePath(filePath);

    const flowInfo: sf.Flow | null = await sf.getLatestFlowInfo(filePath);

    if (!flowInfo?.Id || !flowInfo.ProcessType) {
      utils.showErrorMessage(`No Flow version found for: ${flowName}`);
      return;
    }

    if (!sf.shouldOfferRunMode(flowInfo.ProcessType)) {
      utils.showWarningMessage(
        `⚠️ Run Mode is not supported for this Flow type: ${flowInfo.ProcessType}`
      );
      return;
    }

    const runPath = `/flow/${flowName}/${flowInfo.Id}`;
    const openCommand = `sf org open --path "${runPath}" --json`;

    await utils.runShellCommand(openCommand);

    utils.showInformationMessage("✅ Opened Flow in Run Mode via CLI");
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow in Run Mode: ${error.message}`);
  }
}

/**
 * Opens the currently active Flow file (if it's a `.flow-meta.xml`) in Run Mode
 */
export async function openCurrentFlowFileInRunMode(): Promise<void> {
  try {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
      utils.showWarningMessage("No active editor found.");
      return;
    }

    const filePath = activeEditor.document.uri.fsPath;

    if (!filePath.endsWith(".flow-meta.xml")) {
      utils.showWarningMessage(
        "The currently active file is not a valid Flow metadata file (.flow-meta.xml)."
      );
      return;
    }

    const flowInfo: sf.Flow | null = await sf.getLatestFlowInfo(filePath);

    if (!flowInfo?.Id || !flowInfo.ProcessType) {
      utils.showErrorMessage("No Flow version found with that name.");
      return;
    }

    if (!sf.shouldOfferRunMode(flowInfo.ProcessType)) {
      utils.showWarningMessage(
        `⚠️ Run Mode is not supported for this Flow type: ${flowInfo.ProcessType}`
      );
      return;
    }

    const flowName = utils.parseFlowNameFromFilePath(filePath);
    const runPath = `/flow/${flowName}/${flowInfo.Id}`;
    const openCommand = `sf org open --path "${runPath}" --json`;

    try {
      await utils.runShellCommand(openCommand);
      utils.showInformationMessage("✅ Opened Flow in Flow Builder via CLI");
    } catch (error: any) {
      utils.showErrorMessage(`Failed to open Flow via CLI: ${error.message}`);
    }

  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow in Builder: ${error.message}`);
  }
}
