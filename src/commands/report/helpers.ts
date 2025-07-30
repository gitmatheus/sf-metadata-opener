import * as vscode from "vscode";
import * as metadata from "../../salesforce/data/report";
import * as handlers from "../handlers";
import * as utils from "../../utils";
import { FileType } from "../../salesforce";
import { createOpenCommand, OpenMode } from "../factory";

/**
 * Handles opening a Report from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: FileType.Report,
    buildOpenCommand: (filePath, mode) =>
      createOpenCommand(
        filePath,
        mode as OpenMode,
        {
          metadataType: FileType.Report,
          fetchMetadata: metadata.getMetadataInfo,
          skipDefaultCli: true, // Reports should always use the custom open command
        },
        context
      ),
  });
}

/**
 * Resolves the browser path to open a Report.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const reportId = ctx.metadata?.Id;
  if (!reportId) throw new Error("Missing Report ID");

  const action = ctx.mode === OpenMode.EDIT ? "edit" : "view";
  return `/lightning/r/Report/${reportId}/${action}?queryScope=userFolders`;
}
