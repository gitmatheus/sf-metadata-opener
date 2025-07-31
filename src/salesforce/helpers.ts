import * as vscode from "vscode";
import * as utils from "../utils";
import * as constants from "../constants";

/**
 * Deploys a specific metadata file to the default Salesforce org using the Salesforce CLI.
 *
 * @param filePath - Absolute path to the metadata file to deploy (e.g., a .flow-meta.xml file).
 * @returns A boolean indicating whether the deployment was successful.
 */
export async function deployMetadata(filePath: string): Promise<boolean> {
  return vscode.window.withProgress<boolean>(
    {
      location: vscode.ProgressLocation.Notification,
      title: constants.EXTENSION_TITLE,
      cancellable: false,
    },
    async (progress) => {
      progress.report({
        message: `Deploying the metadata ...`,
      });

      const deployCmd = `sf project deploy start --source-dir "${filePath}" --json`;

      try {
        const deployOutput = await utils.runShellCommand(deployCmd);
        const deployResult = JSON.parse(deployOutput);

        if (deployResult.status !== 0) {
          utils.showErrorMessage(
            `Flow deployment failed: ${
              deployResult.message || deployResult.stderr
            }`
          );
          return false;
        }

        return true;
      } catch (error: any) {
        utils.showErrorMessage(`Deployment error: ${error.message}`);
        return false;
      }
    }
  );
}

/**
 * Builds the default `sf org open` command to launch a metadata in the browser.
 */
export async function buildDefaultOpenCommand(
  filePath: string
): Promise<string> {
  return `sf org open --source-file ${filePath}`;
}

/**
 * Strips common Salesforce custom suffixes from object or field names.
 * Handles: __c, __r, __x, __mdt
 */
export function stripSalesforceSuffix(name: string): string {
  const suffixes = ["__c", "__r", "__x", "__mdt"];
  for (const suffix of suffixes) {
    if (name.endsWith(suffix)) {
      return name.slice(0, -suffix.length);
    }
  }
  return name;
}

/**
 * Custom Salesforce object regex, to match suffixes
 */
export const customObjectRegex = /^(.+)(__[a-z]+)$/i;

/**
 * Determines whether the given SObject name is custom.
 */
export function isCustomSObjectName(name: string): boolean {
  return customObjectRegex.test(name);
}

/**
 * Normalizes the SObject name by stripping the custom suffix (e.g., __c, __x).
 */
export function normalizeSObjectName(developerName: string): string {
  if (isCustomSObjectName(developerName)) {
    return developerName.replace(customObjectRegex, "");
  }

  return developerName;
}