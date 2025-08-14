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
 * Handles opening a ValidationRule from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: FileType.ValidationRule,
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
    return createOpenCommand(
      filePath,
      mode,
      {
        metadataType: FileType.ValidationRule,
        fetchMetadata: (name, type, ctx) =>
          retriever.retrieveRecord(
            name,
            type,
            ctx,
            resolveParentObjectName(filePath)
          ),
      },
      context
    );
  };
}

/**
 * Resolves the browser path to open a ValidationRule.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const recordId = ctx.metadata?.Id;
  const parentObjectName = ctx.metadata?.ParentObjectName;
  if (!recordId) throw new Error("Missing ValidationRule ID");

  const action = ctx.mode === OpenMode.EDIT ? "edit" : "view";
  return `/lightning/setup/ObjectManager/${parentObjectName}/ValidationRules/${recordId}/${action}`;
}

/**
 * Resolves the parent object name from the file path.
 * Assumes the file path follows the pattern: `{ParentObjectName}/validationRules/{ValidationRuleName}.validationRule-meta.xml`
 */
export function resolveParentObjectName(filePath: string): string {
  const match = filePath.match(/objects\/([^/]+)\/validationRules\//);
  const parentObjectName = match?.[1];

  if (!parentObjectName) {
    throw new Error(
      "Unable to determine validation rule's parent entity's name from file path"
    );
  }

  return parentObjectName;
}
