import * as vscode from "vscode";
import * as utils from "../utils";
import * as constants from "../constants";

const RUN_MODE_SUPPORTED_TYPES = new Set([
  "Flow",         // Main supported type for screen flows
  "ScreenFlow"    // Some APIs or tools may refer to it this way
]);

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
 * Determines whether the given Flow type supports being run in "Run Mode"
 */
export function shouldOfferRunMode(processType: string): boolean {
  return RUN_MODE_SUPPORTED_TYPES.has(processType);
}