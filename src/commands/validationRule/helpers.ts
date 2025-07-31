import * as vscode from "vscode";
import * as metadata from "../../salesforce/data/validationRule";
import * as handlers from "../handlers";
import * as utils from "../../utils";
import { FileType } from "../../salesforce";
import { createOpenCommand, OpenMode } from "../factory";

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
    buildOpenCommand: (filePath, mode) =>
      createOpenCommand(
        filePath,
        mode as OpenMode,
        {
          metadataType: FileType.ValidationRule,
          fetchMetadata: (name, type, context) => metadata.retrieveRecord(name, type, context, resolveParentObjectName(filePath)),
          skipDefaultCli: true, // Validation Rules should always use the custom open command
        },
        context
      ),
  });
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
export function resolveParentObjectName(
  filePath: string,
): string {
  const match = filePath.match(/objects\/([^/]+)\/validationRules\//);
  const parentObjectName = match?.[1];

  if (!parentObjectName) {
    throw new Error("Unable to determine validation rule's parent entity's name from file path");
  }

  return parentObjectName;
}