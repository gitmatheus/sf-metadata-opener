import * as vscode from "vscode";
import * as utils from "../../utils";
import { open } from "./helpers";
import {OpenMode} from "../builder";

/**
 * Opens Flow in Flow Builder via context menu (right-click)
 */
export function openFlowInBuilder(uri: vscode.Uri) {
  return open(uri.fsPath, OpenMode.EDIT);
}

/**
 * Opens Flow in Run Mode via context menu (right-click)
 */
export function openFlowInRunMode(uri: vscode.Uri) {
  return open(uri.fsPath, OpenMode.RUN);
}

/**
 * Opens Flow in Flow Builder via command palette
 */
export async function openCurrentFlowFileInBuilder() {
  const filePath = utils.resolveFilePathFromEditor();
  if (!filePath) {
    return utils.showWarningMessage("No active editor found.");
  }
  return open(filePath, OpenMode.EDIT);
}

/**
 * Opens Flow in Run Mode via command palette
 */
export async function openCurrentFlowFileInRunMode() {
  const filePath = utils.resolveFilePathFromEditor();
  if (!filePath) {
    return utils.showWarningMessage("No active editor found.");
  }
  return open(filePath, OpenMode.RUN);
}
