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
export async function buildOpenFileCommand(filePath: string): Promise<string> {
  return `sf org open --source-file ${filePath}`;
}

export function getCustomSObjectSuffix(developerName: string): string | null {
  const name = developerName.toLowerCase();

  for (const suffix of Object.keys(constants.SOBJECT_CUSTOM_SUFFIXES)) {
    if (name.endsWith(suffix.toLowerCase())) {
      return suffix;
    }
  }

  return null;
}

/**
 * Removes the custom suffix from the developer name, if one exists.
 */
export function normalizeSObjectName(developerName: string): string {
  const suffix = getCustomSObjectSuffix(developerName);
  return suffix ? developerName.slice(0, -suffix.length) : developerName;
}

/**
 * Determines if the SObject is custom by checking for known suffixes.
 */
export function isCustomSObjectName(developerName: string): boolean {
  return getCustomSObjectSuffix(developerName) !== null;
}

/**
 * Determines if the given field API name represents a standard field.
 * Custom fields always end with '__c' in Salesforce.
 */
export function isStandardField(developerName: string): boolean {
  return !developerName.endsWith("__c");
}

/**
 * Determines if the given SObject API name represents a standard object.
 */
export function isStandardSObject(developerName: string): boolean {
  return !isCustomSObjectName(developerName);
}

/**
 * Returns the type label for a custom object suffix, if any.
 */
export function getSObjectTypeLabel(developerName: string): string | null {
  const suffix = getCustomSObjectSuffix(developerName);
  return suffix ? constants.SOBJECT_CUSTOM_SUFFIXES[suffix] : null;
}
