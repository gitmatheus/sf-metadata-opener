import * as vscode from "vscode";
import * as utils from "../../utils";
import { open } from "./helpers";
import { OpenMode } from "./../builder";

/**
 * Opens Bot in Builder via context menu or file path
 */
export function openBotInBuilder(uri: vscode.Uri) {
  return open(uri.fsPath, OpenMode.EDIT);
}

/**
 * Opens Bot in Setup via context menu or file path
 */
export function openBotInSetup(uri: vscode.Uri) {
  return open(uri.fsPath, OpenMode.VIEW);
}

/**
 * Opens currently active Bot file in Builder (Command Palette)
 */
export async function openCurrentBotFileInBuilder() {
  const filePath = utils.resolveFilePathFromEditor();
  if (!filePath) {
    return utils.showWarningMessage("No active editor found.");
  }
  return open(filePath, OpenMode.EDIT);
}

/**
 * Opens currently active Bot file in Setup (Command Palette)
 */
export async function openCurrentBotFileInSetup() {
  const filePath = utils.resolveFilePathFromEditor();
  if (!filePath) {
    return utils.showWarningMessage("No active editor found.");
  }
  return open(filePath, OpenMode.VIEW);
}
