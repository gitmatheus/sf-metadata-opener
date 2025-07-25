import * as vscode from "vscode";
import * as utils from "../utils";

/**
 * Factory for generating open handlers for both context menu and command palette commands.
 *
 * This utility allows you to avoid duplicating logic when registering VS Code commands
 * that open metadata files in different modes (e.g., edit, run, view).
 *
 * @param open - The core open function to execute, which receives a file path and a mode.
 * @returns An object with two handler creators:
 *   - `fromUri`: for commands that receive a file via context menu (e.g., right-click)
 *   - `fromEditor`: for commands invoked from the command palette (uses active editor)
 */
export function createOpenHandlers<TMode extends string>(
  open: (filePath: string, mode: TMode) => Promise<void>
) {
  return {
    /**
     * Handler for context menu command (when file is passed in)
     */
    fromUri: (mode: TMode) => {
      return (uri: vscode.Uri) => open(uri.fsPath, mode);
    },

    /**
     * Handler for command palette command (uses active file)
     */
    fromEditor: (mode: TMode) => {
      return async () => {
        const filePath = utils.resolveFilePathFromEditor();
        if (!filePath) {
          return utils.showWarningMessage("No active editor found.");
        }
        return open(filePath, mode);
      };
    }
  };
}