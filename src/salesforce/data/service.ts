import * as vscode from "vscode";
import * as utils from "../../utils";
import { Properties } from "../../properties";
import { FileType, MetadataLabels } from "../../salesforce";
import { readCachedMetadata, writeCachedMetadata } from "./cache";

/**
 * Generic helper to retrieve Salesforce metadata using the CLI with optional caching and progress feedback.
 */
export async function retrieve<T>({
  metadataName,
  metadataType,
  getCommand,
  parseResult,
  context,
  skipCacheCheck = false,
  parentKey,
}: {
  metadataName: string;
  metadataType: FileType;
  getCommand: (name: string) => string;
  parseResult: (data: any) => T | null;
  context: vscode.ExtensionContext;
  skipCacheCheck?: boolean;
  parentKey?: string; // New optional parameter
}): Promise<T | null> {
  const metadataLabel = MetadataLabels[metadataType] ?? metadataType;

  // Try reading from the cache unless explicitly disabled
  if (Properties.enableCaching && !skipCacheCheck) {
    const cached = await tryReadFromCache<T>(metadataName, context, parentKey);
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
          message: `Retrieving ${metadataLabel} information: "${metadataName}"`,
        });

        const result = await fetchAndParse<T>(
          metadataName,
          getCommand,
          parseResult
        );
        if (!result) {
          utils.showErrorMessage(`${metadataLabel} not found. Double-check if it's deployed to your org.`);
          return null;
        }

        // Save the result to cache for future use
        if (Properties.enableCaching && !skipCacheCheck) {
          await writeCachedMetadata(metadataName, result, context, parentKey);
        }

        return result;
      } catch (error: any) {
        // Handle known "no record" CLI error
        if (error?.name === "DataRecordGetNoRecord") {
          utils.showErrorMessage(`${metadataLabel} not found. Double-check if it's deployed to your org.`);
          return null;
        }

        utils.showErrorMessage(
          `Error retrieving ${metadataLabel}: ${error.message}`
        );
        return null;
      }
    }
  );
}

/**
 * Attempts to read metadata from the local cache.
 */
async function tryReadFromCache<T>(
  metadataName: string,
  context: vscode.ExtensionContext,
  parentKey?: string
): Promise<T | null> {
  const cached = await readCachedMetadata<T>(metadataName, context, parentKey);
  return cached ?? null;
}

/**
 * Executes the CLI command, parses the result, and returns the metadata object.
 */
async function fetchAndParse<T>(
  metadataName: string,
  getCommand: (name: string) => string,
  parseResult: (data: any) => T | null
): Promise<T | null> {
  // Clean up the metadata name to ensure it's safe for shell execution
  const sanitizedName = utils.sanitizeName(metadataName);

  // Build the CLI command using the sanitized name
  const command = getCommand(sanitizedName);

  // Run the command in the shell and capture the output
  const output = await utils.runShellCommand(command);

  // Parse the output string into a JSON object
  const json = JSON.parse(output);

  // Use the caller-provided function to extract and structure the result
  return parseResult(json);
}
