import * as vscode from "vscode";
import * as sf from "../salesforce";
import * as utils from "../utils";

/**
 * Opens the Flow in Flow Builder
 */
export async function openFlowInBuilder(uri: vscode.Uri) {
  try {
    const flowName = utils.parseFlowNameFromFilePath(uri.fsPath);
    const flowInfo: sf.Flow | null = await sf.getLatestFlowInfo(flowName);

    // Return early if flowInfo is null or missing required properties
    if (!flowInfo || !flowInfo.Id) {
      return;
    }

    const domain = await sf.getOrgDomain();

    const url = `${domain}/builder_platform_interaction/flowBuilder.app?flowId=${flowInfo.Id}`;
    vscode.env.openExternal(vscode.Uri.parse(url));
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Failed to open Flow in Builder: ${error.message}`
    );
  }
}

/**
 * Opens the currently active Flow file (if it's a `.flow-meta.xml`) in Flow Builder
 */
export async function openCurrentFlowFileInBuilder(): Promise<void> {
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

  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow in Builder: ${error.message}`);
  }
}
