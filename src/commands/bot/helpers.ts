import * as sf from "../../salesforce";
import * as utils from "../../utils";
import { Properties } from "../../properties";
import * as builder from "../builder";


/**
 * Handles opening a Bot file from right-click or command palette.
 */
export async function open(filePath: string, mode: builder.OpenMode): Promise<void> {
  if (!filePath.endsWith(sf.FileType.Bot)) {
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
      mode === builder.OpenMode.EDIT ? "Agentforce Builder" : "Agent Details (Setup)";

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
  mode: builder.OpenMode
): Promise<string | null> {
  return builder.buildOpenCommand(filePath, mode, {
    cliMode: builder.OpenMode.EDIT,
    metadataType: sf.FileType.Bot,
    fetchMetadata: sf.getLatestBotInfo
  });
}
