import * as sf from "../../salesforce";
import * as utils from "../../utils";
import { Properties } from "../../properties";
import * as fs from "fs/promises";
import * as xml2js from "xml2js";
import * as builder from "../builder";

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
  mode: builder.OpenMode
): Promise<void> {
  if (!filePath.endsWith(sf.FileType.Flow)) {
    utils.showWarningMessage(
      `The selected file is not a valid Flow metadata file (${sf.FileType.Flow}).`
    );
    return;
  }

  if (mode === builder.OpenMode.RUN) {
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
  if (!openCommand) return;

  try {
    await utils.runShellCommand(openCommand);

    const action = mode === builder.OpenMode.EDIT ? "Flow Builder" : "Run Mode";

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
  mode: builder.OpenMode
): Promise<string | null> {
  return builder.buildOpenCommand(filePath, mode, {
    cliMode: builder.OpenMode.EDIT,
    metadataType: sf.FileType.Flow,
    fetchMetadata: sf.getLatestFlowInfo,
  });
}

/**
 * Determines whether the given Flow type supports being run in "Run Mode"
 */
function shouldOfferRunMode(processType: string): boolean {
  return RUN_MODE_SUPPORTED_TYPES.has(processType);
}
