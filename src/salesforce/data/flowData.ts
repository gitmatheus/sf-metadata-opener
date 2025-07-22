import * as vscode from "vscode";
import * as utils from "../../utils";
import * as constants from "../../constants";
import { Flow } from "../../salesforce";

/**
 * Queries Salesforce to get the latest Flow version info by flow name
 */
export async function getLatestFlowInfo(
  filePath: string
): Promise<Flow | null> {
  const flowName = utils.parseFlowNameFromFilePath(filePath);

  return vscode.window.withProgress<Flow | null>(
    {
      location: vscode.ProgressLocation.Notification,
      title: constants.EXTENSION_TITLE,
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({
          message: `Querying latest version for Flow: ${flowName} ...`,
        });

        // Uses get record command with tooling API to get the latest Flow version
        const command = `sf data get record --use-tooling-api --sobject FlowDefinition --where "DeveloperName='${flowName}'" --json`;
        const output = await utils.runShellCommand(command);
        const data = JSON.parse(output);

        if (data?.result?.LatestVersionId) {
          return {
            Id: data.result.LatestVersionId,
          };
        } else {
          utils.showErrorMessage(`No flow found with API name: ${flowName}`);
          return null;
        }
      } catch (error: any) {
        utils.showErrorMessage(`Error retrieving flow: ${error.message}`);
        return null;
      }
    }
  );
}
