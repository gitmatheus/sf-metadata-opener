import * as vscode from "vscode";
import * as utils from "../../utils";
import * as constants from "../../constants";
import { Bot, BotVersion } from "..";

/**
 * Retrieves the BotDefinition and latest BotVersion from Salesforce for the given bot name.
 */
export async function getMetadataInfo(
  metadataName: string
): Promise<{ bot: Bot; version: BotVersion } | null> {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: constants.EXTENSION_TITLE,
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({
          message: `Retrieving metadata info for: ${metadataName}`,
        });

        const query = `
          SELECT Id, DeveloperName, MasterLabel,
            (SELECT Id, Status, VersionNumber FROM BotVersions ORDER BY VersionNumber DESC LIMIT 1)
          FROM BotDefinition
          WHERE DeveloperName = '${metadataName}' 
            AND IsDeleted = false
          LIMIT 1`;

        const cmd = `sf data query --query "${query}" --json`;
        const output = await utils.runShellCommand(cmd);

        const parsed = JSON.parse(output);

        const bot: Bot | undefined = parsed?.result?.records?.[0];
        const version: BotVersion | undefined = bot?.BotVersions?.records?.[0];

        if (!bot?.Id || !version?.Id) {
          utils.showErrorMessage(
            `No BotDefinition or versions found for DeveloperName: ${metadataName}`
          );
          return null;
        }

        return { bot, version };
      } catch (error: any) {
        utils.showErrorMessage(`Error retrieving bot info: ${error.message}`);
        return null;
      }
    }
  );
}
