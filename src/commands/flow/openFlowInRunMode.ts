import * as vscode from "vscode";
import { openFlow, FlowOpenMode } from "./helpers";

/**
 * Opens Flow in Run Mode via context menu (right-click)
 */
export function openFlowInRunMode(uri: vscode.Uri) {
  return openFlow(uri.fsPath, FlowOpenMode.RUN);
}

/**
 * Opens Flow in Run Mode via command palette
 */
export async function openCurrentFlowFileInRunMode() {
  const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  if (!filePath) {
    return vscode.window.showWarningMessage("No active editor found.");
  }
  return openFlow(filePath, FlowOpenMode.RUN);
}
