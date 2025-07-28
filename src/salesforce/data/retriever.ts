import * as vscode from "vscode";
import * as utils from "../../utils";
import { FileType, MetadataLabels } from "../../salesforce";

/**
 * Generic helper to retrieve Salesforce metadata with CLI + progress feedback.
 */
export async function retrieveMetadata<T>({
  metadataName,
  metadataType,
  getCommand,
  parseResult,
}: {
  metadataName: string;
  metadataType: FileType;
  getCommand: (name: string) => string;
  parseResult: (data: any) => T | null;
}): Promise<T | null> {
  const metadataLabel = MetadataLabels[metadataType] ?? metadataType;

  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({
          message: `Retrieving record info for ${metadataLabel}: "${metadataName}"`,
        });

        const command = getCommand(metadataName);

        const output = await utils.runShellCommand(command);
        const json = JSON.parse(output);

        const result = parseResult(json);
        if (!result) {
          utils.showErrorMessage(`${metadataLabel} not found.`);
          return null;
        }

        return result;
      } catch (error: any) {
        utils.showErrorMessage(
          `Error retrieving ${metadataLabel}: ${error.message}`
        );
        return null;
      }
    }
  );
}
