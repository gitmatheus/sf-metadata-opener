import * as vscode from "vscode";
import * as utils from "../utils";
import * as sf from "../salesforce";
import { Properties } from "../properties";

/**
 * Modes in which the metadata can be opened
 */
export enum OpenMode {
  RUN = "run",
  EDIT = "edit",
  VIEW = "view",
}

/**
 * Indicates which OpenModes support the use of default cli commands
 */
export const AllowDefaultCliMode: Record<OpenMode, boolean> = {
  [OpenMode.RUN]: false,
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
  mode: string,
  options: {
    metadataType: sf.FileType;
    fetchMetadata: (metadataName: string, metadataType: sf.FileType) => Promise<T | null>;
  }
): Promise<string | null> {
   if (Properties.useSfCommandToOpenMetadata && AllowDefaultCliMode[mode as OpenMode]) {
    return sf.buildDefaultOpenCommand(filePath);
  }

  const metadataName = utils.parseMetadataNameFromFilePath(
    filePath,
    options.metadataType
  );
  const metadata = await options.fetchMetadata(metadataName, options.metadataType);
  if (!metadata) return null;

  const path = utils.resolveMetadataPath({
    filePath,
    mode,
    fileType: options.metadataType,
    metadataName,
    metadata,
  });

  return `sf org open --path "${path}"`;
}
