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
 * Handles opening a Permission Set from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: factory.OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: sf.FileType.PermissionSet,
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
        metadataType: sf.FileType.PermissionSet,
        fetchMetadata: retriever.retrieveRecord,
        canUseOpenFileCommand: false, // no default CLI support for PermissionSet
      },
      context
    );
  };
}

/**
 * Builds the view-only URL for the Permission Set Summary page.
 * Example: /lightning/setup/PermSets/{id}/summary
 */
function buildViewUrl(id: string): string {
  return `/lightning/setup/PermSets/${id}/summary`;
}

/**
 * Builds the editable Setup URL for the Permission Set detail page.
 * Example: /lightning/setup/PermSets/page?address=%2F{id}
 */
function buildEditUrl(id: string): string {
  return `/lightning/setup/PermSets/page?address=%2F${id}`;
}

/**
 * Resolves the Lightning path for a Permission Set depending on mode
 */
export function resolvePath(ctx: utils.PathContext): string {
  const record = ctx.metadata as sf.PermissionSet;
  const id = record?.Id;

  if (!id) {
    throw new Error("Missing PermissionSet Id.");
  }

  return ctx.mode === factory.OpenMode.VIEW
    ? buildViewUrl(id)
    : buildEditUrl(id);
}
