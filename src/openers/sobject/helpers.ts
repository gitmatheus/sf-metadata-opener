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
 * Resolves the browser path to open a SObject in Setup.
 * - For standard objects (e.g., Account), uses the API name directly.
 * - For custom objects (with an Id), returns the real editable form via `address` param.
 *   Without this param, Salesforce would incorrectly show the read-only view.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const record =  ctx.metadata as sf.SObject;
  const id = record?.Id;
  const apiName = record?.DeveloperName;

  if (!id && !apiName) {
    throw new Error("Missing SObject Id or DeveloperName.");
  }

  if (id && ctx.mode === factory.OpenMode.EDIT && record?.isCustom) {
    return buildCustomObjectEditUrl(id);
  }

  // Use Id if present, otherwise fallback to API name (standard object)
  const identifier = id ?? apiName;
  const action = ctx.mode === factory.OpenMode.EDIT ? "edit" : "view";
  return `/lightning/setup/ObjectManager/${identifier}/${action}`;
}

/**
 * Builds the full editable Setup URL for a custom object, including the `address` redirect.
 */
function buildCustomObjectEditUrl(id: string): string {
  const retUrl = encodeURIComponent(`/setup/object/${id}`);
  const address = encodeURIComponent(`/${id}/e?retURL=${retUrl}`);
  return `/lightning/setup/ObjectManager/${id}/edit?address=${address}`;
}
