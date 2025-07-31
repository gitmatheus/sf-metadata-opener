import * as vscode from "vscode";
import * as retriever from "./retriever";
import * as handlers from "../handlers";
import * as utils from "../../utils";
import { FileType } from "../../salesforce";
import { createOpenCommand, OpenMode } from "../factory";

/**
 * Registers the open handlers for the extension context
 */
export function registerHandlers(context: vscode.ExtensionContext) {
  return handlers.registerHandlers(open, context);
}

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
          fetchMetadata: retriever.retrieveRecord,
        },
        context
      ),
  });
}

/**
 * Resolves the browser path to open a Report.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const recordId = ctx.metadata?.Id;
  if (!recordId) throw new Error("Missing Report ID");

  const action = ctx.mode === OpenMode.EDIT ? "edit" : "view";
  return `/lightning/r/Report/${recordId}/${action}?queryScope=userFolders`;
}
