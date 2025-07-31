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
 * Handles opening a SObject from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: factory.OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: sf.FileType.SObject,
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
        metadataType: sf.FileType.SObject,
        fetchMetadata: retriever.retrieveRecord,
      },
      context
    );
  };
}

/**
 * Resolves the browser path to open a SObject.
 */
export function resolvePath(ctx: utils.PathContext): string {
  // Prefer Id for custom objects, fallback to API name for standard ones
  const recordId = ctx.metadata?.Id || ctx.metadata?.DeveloperName;
  if (!recordId) throw new Error("Missing SObject Id or API Name");

  const action = ctx.mode === factory.OpenMode.EDIT ? "edit" : "view";
  return `/lightning/setup/ObjectManager/${recordId}/${action}`;
}
