import * as sf from "../../salesforce";
import * as utils from "../../utils";
import { Properties } from "../../properties";
import * as fs from "fs/promises";
import * as xml2js from "xml2js";

/**
 * Mode in which the Flow will be opened
 */
export enum Mode {
  RUN = "run",
  EDIT = "edit",
}

/**
 * Supported Flow types for Run Mode
 */
const RUN_MODE_SUPPORTED_TYPES = new Set([
  "Flow", // Main supported type for screen flows
  "ScreenFlow", // Some APIs or tools may refer to it this way
]);

/**
 * Handles opening a Flow file (right-click or command palette)
 */
export async function open(
  filePath: string,
  mode: Mode
): Promise<void> {
  if (!filePath.endsWith(sf.Extensions.Flow)) {
    utils.showWarningMessage(
      `The selected file is not a valid Flow metadata file (${sf.Extensions.Flow}).`
    );
    return;
  }

  if (mode === Mode.RUN) {
    const processType = await parseProcessTypeFromXml(filePath);
    // Validate if Run Mode is allowed
    if (!processType || !shouldOfferRunMode(processType)) {
      utils.showWarningMessage(
        `Run Mode is not supported for this Flow type: ${
          processType || "Unknown"
        }`
      );
      return;
    }
  }

  // Deploy the metadata file before attempting to open it
  // This ensures the latest version is available in Salesforce
  if (Properties.deployBeforeOpen) {
    const deployed = await sf.deployMetadata(filePath);
    if (!deployed) {
      return; // Stop if deployment failed
    }
  }

  let openCommand = await buildOpenCommand(filePath, mode);
  if (!openCommand) {
    return;
  }

  try {
    await utils.runShellCommand(openCommand);
    const action = mode === Mode.RUN ? "Run Mode" : "Flow Builder";
    utils.showInformationMessage(`Opened Flow in ${action} via CLI`);
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow via CLI: ${error.message}`);
  }
}

/**
 * Reads the ProcessType value from a xml file
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

/**
 * Builds the appropriate `sf org open` command to launch a Flow in the browser.
 *
 * If the user has enabled the `useSfCommandToOpenMetadata` setting and the mode is EDIT,
 * the function returns a direct `--source-file` CLI command.
 * Otherwise, it queries Salesforce to retrieve the Flow ID and constructs the appropriate
 * path for either Run Mode or Flow Builder mode.
 */
async function buildOpenCommand(
  filePath: string,
  mode: Mode
): Promise<string | null> {
  if (Properties.useSfCommandToOpenMetadata && mode === Mode.EDIT) {
    return sf.buildDefaultOpenCommand(filePath);
  }

  // If not using sf command, or not in Edit mode, we need to get the Flow info from Salesforce
  const flowInfo = await sf.getLatestFlowInfo(filePath);

  if (!flowInfo?.Id) {
    return null;
  }

  const flowName = utils.parseFlowNameFromFilePath(filePath);
  const runPath =
    mode === Mode.RUN
      ? `/flow/${flowName}/${flowInfo.Id}`
      : `/builder_platform_interaction/flowBuilder.app?flowId=${flowInfo.Id}`;

  return `sf org open --path "${runPath}" --json`;
}

/**
 * Determines whether the given Flow type supports being run in "Run Mode"
 */
function shouldOfferRunMode(processType: string): boolean {
  return RUN_MODE_SUPPORTED_TYPES.has(processType);
}
