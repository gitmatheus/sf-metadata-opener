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
 * Handles opening a Bot file from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: FileType.Bot,
    buildOpenCommand: getOpenCommandBuilder(context),
  });
}

/**
 * Returns a function that builds the open command for this opener
 */
function getOpenCommandBuilder(context: vscode.ExtensionContext) {
  return async (filePath: string, mode: OpenMode) => {
    return createOpenCommand(
      filePath,
      mode,
      {
        metadataType: FileType.Bot,
        fetchMetadata: retriever.retrieveRecord,
      },
      context
    );
  };
}

/**
 * Resolves the browser path to open a Bot.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const recordId = ctx.metadata?.bot?.Id;
  const versionId = ctx.metadata?.version?.Id;
  if (!recordId) throw new Error("Missing Bot ID");

  return ctx.mode === OpenMode.EDIT
    ? `/AiCopilot/copilotStudio.app#/copilot/builder?copilotId=${recordId}&versionId=${versionId}`
    : `/lightning/setup/EinsteinCopilot/${recordId}/edit`;
}
