import * as vscode from "vscode";
import * as utils from "../../utils";
import { Properties } from "../../properties";
import { FileType, MetadataLabels } from "../../salesforce";
import { readCachedMetadata, writeCachedMetadata } from "./cache";
import type { Metadata } from "../../salesforce/model/metadata";

/**
 * Generic helper to retrieve Salesforce metadata with CLI + progress feedback.
 */
export async function retrieveMetadata<T>({
  metadataName,
  metadataType,
  getCommand,
  parseResult,
  context,
  skipCacheCheck = false, // Optional flag to ignore cached values
}: {
  metadataName: string;
  metadataType: FileType;
  getCommand: (name: string) => string;
  parseResult: (data: any) => T | null;
  context: vscode.ExtensionContext;
  skipCacheCheck?: boolean;
}): Promise<T | null> {
  const metadataLabel = MetadataLabels[metadataType] ?? metadataType;

  // 💾 Try memory/disk cache first (unless explicitly skipped)
  if (Properties.enableCaching && !skipCacheCheck) {
    const cached = await readCachedMetadata<T>(metadataName, context);
    if (cached) return cached;
  }

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

        const command = getCommand(utils.sanitizeName(metadataName));
        const output = await utils.runShellCommand(command);
        const json = JSON.parse(output);

        const result = parseResult(json);
        if (!result) {
          utils.showErrorMessage(`${metadataLabel} not found.`);
          return null;
        }

        // 💾 Store full object in cache
        if (Properties.enableCaching && !skipCacheCheck) {
          await writeCachedMetadata(metadataName, result, context);
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
