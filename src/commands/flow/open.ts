import * as vscode from "vscode";
import * as utils from "../../utils";
import { open, Mode } from "./helpers";

/**
 * Opens Flow in Flow Builder via context menu (right-click)
 */
export function openFlowInBuilder(uri: vscode.Uri) {
  return open(uri.fsPath, Mode.EDIT);
}

/**
 * Opens Flow in Run Mode via context menu (right-click)
 */
export function openFlowInRunMode(uri: vscode.Uri) {
  return open(uri.fsPath, Mode.RUN);
}

/**
 * Opens Flow in Flow Builder via command palette
 */
export async function openCurrentFlowFileInBuilder() {
  const filePath = utils.resolveFilePathFromEditor();
  if (!filePath) {
    return utils.showWarningMessage("No active editor found.");
  }
  return open(filePath, Mode.EDIT);
}

/**
 * Opens Flow in Run Mode via command palette
 */
export async function openCurrentFlowFileInRunMode() {
  const filePath = utils.resolveFilePathFromEditor();
  if (!filePath) {
    return utils.showWarningMessage("No active editor found.");
  }
  return open(filePath, Mode.RUN);
}
