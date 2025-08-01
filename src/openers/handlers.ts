import * as vscode from "vscode";
import * as utils from "../utils";
import * as sf from "../salesforce";
import { Properties } from "../properties";
import { OpenMode } from "./factory";

/**
 * Standardized handler to open a metadata file by path and mode.
 *
 * This encapsulates common behaviors like file extension validation,
 * conditional deploys, open command building, and CLI feedback.
 */
export async function openMetadata<T>({
  filePath,
  mode,
  fileType,
  buildOpenCommand,
}: {
  filePath: string;
  mode: OpenMode;
  fileType: sf.FileType;
  buildOpenCommand: (
    filePath: string,
    mode: OpenMode
  ) => Promise<string | null>;
}): Promise<void> {
  const metadataLabel = sf.MetadataLabels[fileType] ?? fileType;

  if (!filePath.endsWith(fileType)) {
    return utils.showWarningMessage(
      `This file is not a valid ${metadataLabel} metadata file.`
    );
  }

  const deployableTypes = Properties.deployableMetadataTypes
    .map((key) => sf.DeployableMetadataKeys[key])
    .filter(Boolean); // in case the config contains an invalid entry

  if (deployableTypes.includes(fileType)) {
    const deployed = await sf.deployMetadata(filePath);
    if (!deployed) return;
  }

  const openCommand = await buildOpenCommand(filePath, mode);
  if (!openCommand) return;

  try {
    await utils.runShellCommand(openCommand);
    utils.showInformationMessage(`${metadataLabel} opened in the browser`);
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open ${metadataLabel}: ${error.message}`);
  }
}

/**
 * Registers open handlers for the extension context.
 *
 * This allows metadata modules to register their open commands
 * without duplicating the handler logic.
 */
export function registerHandlers(
  openFn: (
    filePath: string,
    mode: OpenMode,
    context: vscode.ExtensionContext
  ) => Promise<void>,
  context: vscode.ExtensionContext
) {
  const handlers = registerOpenHandlers(openFn, context);
  return {
    openInEditMode: handlers.inEditMode,
    openInViewMode: handlers.inViewMode,
    openFileInEditMode: handlers.currentInEditMode,
    openFileInViewMode: handlers.currentInViewMode,
  };
}

/**
 * Creates standard open handlers for common metadata types.
 * Used to avoid duplicate `open.ts` files for each metadata module.
 */
export function registerOpenHandlers(
  openFn: (
    filePath: string,
    mode: OpenMode,
    context: vscode.ExtensionContext
  ) => Promise<void>,
  context: vscode.ExtensionContext
) {
  return {
    inEditMode: (uri: vscode.Uri) => openFn(uri.fsPath, OpenMode.EDIT, context),
    inViewMode: (uri: vscode.Uri) => openFn(uri.fsPath, OpenMode.VIEW, context),

    currentInEditMode: () => {
      const filePath = utils.resolveFilePathFromEditor();
      if (filePath) return openFn(filePath, OpenMode.EDIT, context);
    },
    currentInViewMode: () => {
      const filePath = utils.resolveFilePathFromEditor();
      if (filePath) return openFn(filePath, OpenMode.VIEW, context);
    },
  };
}
