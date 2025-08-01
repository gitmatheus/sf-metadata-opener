import * as vscode from "vscode";
import * as retriever from "./retriever";
import * as utils from "../../utils";
import * as fs from "fs/promises";
import * as xml2js from "xml2js";
import * as handlers from "../handlers";
import { createOpenCommand, OpenMode } from "../factory";
import { FileType } from "../../salesforce";

/**
 * Registers the open handlers for the extension context
 */
export function registerHandlers(context: vscode.ExtensionContext) {
  return handlers.registerHandlers(open, context);
}

/**
 * Supported Flow types for View Mode
 */
const RUN_MODE_SUPPORTED_TYPES = new Set([
  "Flow", // Main supported type for screen flows
  "ScreenFlow", // Some APIs or tools may refer to it this way
]);

/**
 * Handles opening a Flow file (right-click or command palette).
 */
export async function open(
  filePath: string,
  mode: OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  if (mode === OpenMode.VIEW) {
    const processType = await parseProcessTypeFromXml(filePath);
    if (!processType || !shouldOfferViewMode(processType)) {
      return utils.showWarningMessage(
        `View Mode is not supported for this Flow type: ${
          processType || "Unknown"
        }`
      );
    }
  }

  return handlers.openMetadata({
    filePath,
    mode,
    fileType: FileType.Flow,
    buildOpenCommand: getOpenCommandBuilder(context),
  });
}

/**
 * Returns a function that builds the open command for this opener
 */
function getOpenCommandBuilder(context: vscode.ExtensionContext) {
  return async (filePath: string, mode: OpenMode) => {
    return createOpenCommand(
      filePath,
      mode,
      {
        metadataType: FileType.Flow,
        fetchMetadata: retriever.retrieveRecord,
        canUseOpenFileCommand: true, // Flows can use the default open file sf command
      },
      context
    );
  };
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
 * Determines whether the given Flow type supports being run in "View Mode"
 */
function shouldOfferViewMode(processType: string): boolean {
  return RUN_MODE_SUPPORTED_TYPES.has(processType);
}

/**
 * Resolves the browser path to open a Flow either in Flow Builder or View Mode.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const recordId = ctx.metadata?.Id;
  if (!recordId) throw new Error("Missing Flow ID");

  return ctx.mode === OpenMode.VIEW
    ? `/flow/${ctx.metadataName}/${recordId}`
    : `/builder_platform_interaction/flowBuilder.app?flowId=${recordId}`;
}
