import * as vscode from "vscode";
import * as retriever from "./retriever";
import * as handlers from "../handlers";
import * as utils from "../../utils";
import * as sf from "../../salesforce";
import * as factory from "../factory";

/**
 * Registers the open handlers for the extension context
 */
export function registerHandlers(context: vscode.ExtensionContext) {
  return handlers.registerHandlers(open, context);
}

/**
 * Handles opening a Profile from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: factory.OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: sf.FileType.Profile,
    buildOpenCommand: getOpenCommandBuilder(context),
  });
}

/**
 * Returns a function that builds the open command for this opener
 */
function getOpenCommandBuilder(context: vscode.ExtensionContext) {
  return async (filePath: string, mode: factory.OpenMode) => {
    return factory.createOpenCommand(
      filePath,
      mode,
      {
        metadataType: sf.FileType.Profile,
        fetchMetadata: retriever.retrieveRecord,
        canUseOpenFileCommand: false, // no default CLI support for Profile
      },
      context
    );
  };
}

/**
 * Resolves the Setup path for a Profile depending on mode
 */
export function resolvePath(ctx: utils.PathContext): string {
  const record = ctx.metadata as sf.Profile;
  const id = record?.Id;

  if (!id) {
    throw new Error("Missing Profile Id.");
  }

  const address = ctx.mode === factory.OpenMode.EDIT ? `/${id}/e` : `/${id}`;
  return `/lightning/setup/EnhancedProfiles/page?address=${encodeURIComponent(address)}`;
}
