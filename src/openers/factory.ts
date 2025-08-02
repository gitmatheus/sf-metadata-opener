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
      name: string,
      type: sf.FileType,
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

  // Check if we can use the simpler `sf open file` command based on mode and settings
  if (mustUseOpenFileCommand(mode, metadataType, canUseOpenFileCommand)) {
    return sf.buildOpenFileCommand(filePath);
  }

  // Extract the metadata name from the file path
  const metadataName = getMetadataName(filePath, metadataType);

  // Fetch the metadata details using the provided fetch function
  const metadata = await fetchMetadata(metadataName, metadataType, context);
  if (!metadata) return null;

  // Build the full browser path to open based on metadata
  const path = buildMetadataPath(
    filePath,
    mode,
    metadataType,
    metadataName,
    metadata
  );

  // Return the complete CLI command to open the metadata in the browser
  return buildOpenPathCommand(path);
}

/**
 * Determines whether the `sf org open --source-file` command should be used
 * to open metadata in the browser instead of resolving the ID manually.
 *
 * This decision is based on the current mode, user settings, and metadata type.
 *
 * @param mode - The mode in which the metadata is being opened (e.g., edit, view)
 * @param metadataType - The metadata type (e.g., "Flow", "FlexiPage")
 * @param canUseOpenFileCommand - Whether this metadata type *technically supports* `sf org open --source-file`
 *                                 (defined by the caller based on extension capabilities)
 *
 * @returns true if the CLI open command should be used
 */
function mustUseOpenFileCommand(
  mode: OpenMode,
  metadataType: sf.FileType,
  canUseOpenFileCommand: boolean
): boolean {
  return (
    canUseOpenFileCommand &&
    Properties.useOpenFileCommand &&
    Properties.openFileSupportedMetadataTypes.includes(metadataType) &&
    AllowOpenFileMode[mode]
  );
}

/**
 * Extracts the metadata name from the file path, based on metadata type
 */
function getMetadataName(filePath: string, type: sf.FileType): string {
  return utils.parseMetadataNameFromFilePath(filePath, type);
}

/**
 * Resolves the browser path using metadata context and provided file info
 */
function buildMetadataPath<T>(
  filePath: string,
  mode: OpenMode,
  type: sf.FileType,
  name: string,
  metadata: T
): string {
  return utils.resolveMetadataPath({
    filePath,
    mode,
    fileType: type,
    metadataName: name,
    metadata,
  });
}

/**
 * Build the open command to open the path in the org
 */
export function buildOpenPathCommand(path: string): string {
  return `sf org open --path "${path}"`;
}
