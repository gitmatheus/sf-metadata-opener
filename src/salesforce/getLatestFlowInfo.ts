import * as vscode from "vscode";
import * as utils from "../utils";
import * as constants from "../constants";
import { Flow } from "../salesforce/model/flow";
import * as fs from "fs/promises";
import * as xml2js from "xml2js";

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
      progress.report({ message: `Deploying Flow metadata...` });

      // 🧠 Deploy flow XML file before querying
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
          return null;
        }

        progress.report({
          message: `Querying latest version for Flow: ${flowName} ...`,
        });

        // Uses get record command with tooling API to get the latest Flow version
        const command = `sf data get record --use-tooling-api --sobject FlowDefinition --where "DeveloperName='${flowName}'" --json`;
        const output = await utils.runShellCommand(command);
        const data = JSON.parse(output);

        if (data?.result?.LatestVersionId) {
          const processType = await parseProcessTypeFromXml(filePath);

          return {
            Id: data.result.LatestVersionId,
            ProcessType: processType,
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

/**
 * Reads the ProcessType value from a .flow-meta.xml file
 */
export async function parseProcessTypeFromXml(
  filePath: string
): Promise<string | undefined> {
  try {
    const fileContents = await fs.readFile(filePath, "utf-8");
    const parser = new xml2js.Parser();
    const parsed = await parser.parseStringPromise(fileContents);

    // Salesforce uses a namespace so we need to access Flow.processType[0]
    const processType = parsed?.Flow?.processType?.[0];

    return processType;
  } catch (error: any) {
    utils.showWarningMessage(
      `Warning: Unable to read processType from XML (${filePath}): ${error.message}`
    );
    return undefined;
  }
}
