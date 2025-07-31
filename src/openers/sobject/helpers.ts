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
    buildOpenCommand: async (filePath, mode) => {
      return factory.createOpenCommand(
        filePath,
        mode,
        {
          metadataType: sf.FileType.SObject,
          fetchMetadata: (name, type, context) =>
            retriever.retrieveRecord(name, type, context),
        },
        context
      );
    },
  });
}

/**
 * Resolves the browser path to open a SObject.
 */
export function resolvePath(ctx: utils.PathContext): string {
  // Prefer Id for custom objects, fallback to API name for standard ones
  const recordId = ctx.metadata?.Id || ctx.metadata?.DeveloperName;
  if (!recordId) throw new Error("Missing SObject Id or API Name");

  return `/lightning/setup/ObjectManager/${recordId}/${factory.OpenMode}`;
}
