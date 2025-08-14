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
 * Handles opening a RecordType from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: FileType.RecordType,
    buildOpenCommand: getOpenCommandBuilder(context, filePath),
  });
}

/**
 * Returns a function that builds the open command for this opener
 */
function getOpenCommandBuilder(
  context: vscode.ExtensionContext,
  filePath: string
) {
  return async (filePath: string, mode: OpenMode) => {
    const fetchEntityId = mode === OpenMode.EDIT;
    return createOpenCommand(
      filePath,
      mode,
      {
        metadataType: FileType.RecordType,
        fetchMetadata: (name, type, ctx) =>
          retriever.retrieveRecord(
            name,
            type,
            ctx,
            resolveParentObjectName(filePath),
            fetchEntityId
          ),
        canUseOpenFileCommand: false,
      },
      context
    );
  };
}

/**
 * Resolves the browser path to open a RecordType.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const recordId = ctx.metadata?.Id;
  const entityId = ctx.metadata?.EntityDefinitionId || ctx.metadata?.SobjectType

  if (!recordId || !entityId) {
    throw new Error("Missing RecordType ID or parent object");
  } 

  const action = ctx.mode === OpenMode.EDIT ? "edit" : "view";
  return `/lightning/setup/ObjectManager/${entityId}/RecordTypes/${recordId}/${action}`;
}

/**
 * Resolves the parent object API name from the file path.
 * Pattern:
 *   objects/{SobjectType}/recordTypes/{DeveloperName}.recordType-meta.xml
 */
export function resolveParentObjectName(filePath: string): string {
  const match = filePath.match(/objects\/([^/]+)\/recordTypes\//);
  const sobject = match?.[1];

  if (!sobject) {
    throw new Error(
      "Unable to determine record type parent object from file path"
    );
  }
  return sobject;
}
