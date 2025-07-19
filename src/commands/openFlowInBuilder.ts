import * as vscode from "vscode";
import * as sf from "../salesforce";
import * as utils from "../utils";

/**
 * Context menu: opens Flow from right-clicked file
 */
export async function openFlowInBuilder(uri: vscode.Uri): Promise<void> {
  try {
    await openFlowBuilderFromFilePath(uri.fsPath);
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow in Builder: ${error.message}`);
  }
}

/**
 * Command palette: opens Flow from the active editor
 */
export async function openCurrentFlowFileInBuilder(): Promise<void> {
  try {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
      utils.showWarningMessage("No active editor found.");
      return;
    }

    await openFlowBuilderFromFilePath(activeEditor.document.uri.fsPath);
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow in Builder: ${error.message}`);
  }
}

/**
 * Shared logic to open any valid .flow-meta.xml file in Flow Builder
 */
async function openFlowBuilderFromFilePath(filePath: string): Promise<void> {
  if (!filePath.endsWith(".flow-meta.xml")) {
    utils.showWarningMessage(
      "The selected file is not a valid Flow metadata file (.flow-meta.xml)."
    );
    return;
  }

  const flowInfo: sf.Flow | null = await sf.getLatestFlowInfo(filePath);

  if (!flowInfo?.Id) {
    utils.showErrorMessage("No Flow version found with that name.");
    return;
  }

  const openCommand = `sf org open --path "/builder_platform_interaction/flowBuilder.app?flowId=${flowInfo.Id}" --json`;

  try {
    await utils.runShellCommand(openCommand);
    utils.showInformationMessage("✅ Opened Flow in Flow Builder via CLI");
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow via CLI: ${error.message}`);
  }
}
