import * as vscode from "vscode";
import * as utils from "../utils";
import * as sf from "../salesforce";
import { Properties } from "../properties";

/**
 * Modes in which the metadata can be opened
 */
export enum OpenMode {
  EDIT = "edit",
  VIEW = "view",
}

/**
 * Indicates which OpenModes support the use of the sf open file command
 */
export const AllowOpenFileMode: Record<OpenMode, boolean> = {
  [OpenMode.EDIT]: true,
  [OpenMode.VIEW]: false,
};

/**
 * Factory for generating open handlers for both context menu and command palette commands.
 *
 * This utility allows you to avoid duplicating logic when registering VS Code commands
 * that open metadata files in different modes (e.g., edit, run, view).
 */
export function createOpenHandlers<TMode extends string>(
  open: (filePath: string, mode: TMode) => Promise<void>
) {
  return {
    fromUri: (mode: TMode) => {
      return (uri: vscode.Uri) => open(uri.fsPath, mode);
    },
    fromEditor: (mode: TMode) => {
      return async () => {
        const filePath = utils.resolveFilePathFromEditor();
        if (!filePath) {
          return utils.showWarningMessage("No active editor found.");
        }
        return open(filePath, mode);
      };
    },
  };
}

/**
 * Builds a dynamic `sf org open` command to launch metadata in the browser.
 */
export async function createOpenCommand<T>(
  filePath: string,
  mode: OpenMode,
  options: {
    metadataType: sf.FileType;
    fetchMetadata: (
      metadataName: string,
      metadataType: sf.FileType,
      context: vscode.ExtensionContext
    ) => Promise<T | null>;
    canUseOpenFileCommand?: boolean;
  },
  context: vscode.ExtensionContext
): Promise<string | null> {
  const {
    metadataType,
    fetchMetadata,
    canUseOpenFileCommand = false,
  } = options;

  const useOpenFileCommand =
    canUseOpenFileCommand && AllowOpenFileMode[mode as OpenMode];
  if (Properties.useOpenFileCommand && useOpenFileCommand) {
    return sf.buildOpenFileCommand(filePath);
  }

  const metadataName = utils.parseMetadataNameFromFilePath(
    filePath,
    metadataType
  );
  const metadata = await fetchMetadata(metadataName, metadataType, context);

  if (!metadata) return null;

  const path = utils.resolveMetadataPath({
    filePath,
    mode,
    fileType: metadataType,
    metadataName,
    metadata,
  });

  return buildOpenPathCommand(path);
}

/**
 * Build the open command to open the path in the org
 */
export function buildOpenPathCommand(path: string): string {
  return `sf org open --path "${path}"`;
}
