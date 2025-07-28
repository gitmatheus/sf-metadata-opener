import * as utils from "../utils";
import * as sf from "../salesforce";
import { Properties } from "../properties";
import { createOpenHandlers, OpenMode } from "./factory";

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
  buildOpenCommand: (filePath: string, mode: OpenMode) => Promise<string | null>;
}): Promise<void> {
  const metadataLabel = sf.MetadataLabels[fileType] ?? fileType;

  if (!filePath.endsWith(fileType)) {
    return utils.showWarningMessage(
      `The selected file is not a valid ${metadataLabel} metadata file.`
    );
  }

  if (Properties.deployBeforeOpen) {
    const deployed = await sf.deployMetadata(filePath);
    if (!deployed) return;
  }

  const openCommand = await buildOpenCommand(filePath, mode);
  if (!openCommand) return;

  try {
    await utils.runShellCommand(openCommand);
    utils.showInformationMessage(`Opened ${metadataLabel} via CLI`);
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open ${metadataLabel}: ${error.message}`);
  }
}

/**
 * Creates standard open handlers for common metadata types.
 *
 * Used to avoid duplicate `open.ts` files for each metadata module.
 */
export function registerOpenHandlers(openFn: (filePath: string, mode: OpenMode) => Promise<void>) {
  const handlers = createOpenHandlers(openFn);

  return {
    inEditMode: handlers.fromUri(OpenMode.EDIT),
    inViewMode: handlers.fromUri(OpenMode.VIEW),
    inRunMode: handlers.fromUri(OpenMode.RUN),

    currentInEditMode: handlers.fromEditor(OpenMode.EDIT),
    currentInViewMode: handlers.fromEditor(OpenMode.VIEW),
    currentInRunMode: handlers.fromEditor(OpenMode.RUN),
  };
}
