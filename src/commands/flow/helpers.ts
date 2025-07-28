import * as metadata from "../../salesforce/data/flow";
import * as utils from "../../utils";
import * as fs from "fs/promises";
import * as xml2js from "xml2js";
import * as handlers from "../handlers";
import { createOpenCommand, OpenMode } from "../factory";
import { FileType } from "../../salesforce";

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
export async function open(filePath: string, mode: OpenMode): Promise<void> {
  if (mode === OpenMode.RUN) {
    const processType = await parseProcessTypeFromXml(filePath);
    if (!processType || !shouldOfferRunMode(processType)) {
      return utils.showWarningMessage(
        `Run Mode is not supported for this Flow type: ${
          processType || "Unknown"
        }`
      );
    }
  }

  return handlers.openMetadata({
    filePath,
    mode,
    fileType: FileType.Flow,
    buildOpenCommand: (filePath, mode) =>
      createOpenCommand(filePath, mode as OpenMode, {
        metadataType: FileType.Flow,
        fetchMetadata: metadata.getMetadataInfo,
      }),
  });
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
 * Determines whether the given Flow type supports being run in "Run Mode"
 */
function shouldOfferRunMode(processType: string): boolean {
  return RUN_MODE_SUPPORTED_TYPES.has(processType);
}

/**
 * Resolves the browser path to open a Flow either in Flow Builder or Run Mode.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const flowId = ctx.metadata?.Id;
  if (!flowId) throw new Error("Missing Flow ID");

  return ctx.mode === OpenMode.RUN
    ? `/flow/${ctx.metadataName}/${flowId}`
    : `/builder_platform_interaction/flowBuilder.app?flowId=${flowId}`;
}
