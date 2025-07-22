import * as sf from "../../salesforce";
import * as utils from "../../utils";
import { Properties } from "../../properties";

/**
 * Mode in which the Agentforce Bot will be opened
 */
export enum Mode {
  BUILDER = "builder",
  SETUP = "edit",
}

/**
 * Handles opening a Bot file from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: Mode
): Promise<void> {
  if (!filePath.endsWith(sf.Extensions.Bot)) {
    utils.showWarningMessage(
      "The selected file is not a valid Agentforce Agent (Bot) metadata file."
    );
    return;
  }

  // Deploy the metadata file before attempting to open it
    // This ensures the latest version is available in Salesforce
    if (Properties.deployBeforeOpen) {
      const deployed = await sf.deployMetadata(filePath);
      if (!deployed) {
        return; // Stop if deployment failed
      }
    }

  const openCommand = await buildOpenCommand(filePath, mode);
  if (!openCommand) return;

  try {
    await utils.runShellCommand(openCommand);
    
    const action =
      mode === Mode.BUILDER
        ? "Agentforce Builder"
        : "Agent Details (Setup)";

    utils.showInformationMessage(`Opened Bot in ${action} via CLI`);
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Bot: ${error.message}`);
  }
}

/**
 * Builds the appropriate CLI command to open a Bot in the browser.
 *
 * If the user has enabled `useSfCommandToOpenMetadata` and is opening in Builder mode,
 * it uses `--source-file`. Otherwise, it queries Salesforce and uses a path-based open.
 */
async function buildOpenCommand(
  filePath: string,
  mode: Mode
): Promise<string | null> {
  if (Properties.useSfCommandToOpenMetadata && mode === Mode.BUILDER) {
    return sf.buildDefaultOpenCommand(filePath);
  }

  const botName = utils.parseBotNameFromFilePath(filePath);

  const info = await sf.getLatestBotInfo(botName);
  if (!info) return null;

  const { bot, version } = info;
  const pathUrl =
    mode === Mode.BUILDER
      ? `/AiCopilot/copilotStudio.app#/copilot/builder?copilotId=${bot.Id}&versionId=${version.Id}`
      : `/lightning/setup/EinsteinCopilot/${bot.Id}/edit`;

  return `sf org open --path "${pathUrl}" --json`;
}
