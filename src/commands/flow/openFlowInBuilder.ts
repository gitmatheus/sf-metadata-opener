import * as vscode from "vscode";
import { openFlow, FlowOpenMode } from "./helpers";

/**
 * Opens Flow in Flow Builder via context menu (right-click)
 */
export function openFlowInBuilder(uri: vscode.Uri) {
  return openFlow(uri.fsPath, FlowOpenMode.EDIT);
}

/**
 * Opens Flow in Flow Builder via command palette
 */
export async function openCurrentFlowFileInBuilder() {
  const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
  if (!filePath) {
    return vscode.window.showWarningMessage("No active editor found.");
  }
  return openFlow(filePath, FlowOpenMode.EDIT);
}
