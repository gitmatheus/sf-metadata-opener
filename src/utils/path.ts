import * as vscode from "vscode";

/**
 * Resolves the file path from the active editor only (used for Command Palette).
 */
export function resolveFilePathFromEditor(): string | undefined {
  return vscode.window.activeTextEditor?.document.uri.fsPath;
}
