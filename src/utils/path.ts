import * as vscode from "vscode";
import * as path from "path";
import { FileType } from "../salesforce";
import { OpenMode } from "../commands/factory";

/**
 * Resolves the absolute file path from the currently active text editor in VS Code.
 */
export function resolveFilePathFromEditor(): string | undefined {
  return vscode.window.activeTextEditor?.document.uri.fsPath;
}

/**
 * Context object used to determine the correct Salesforce Setup or Builder URL
 * for a given metadata file, based on its type, mode, and fetched metadata content.
 */
export type PathContext = {
  filePath: string; // Absolute file path of the local metadata file
  mode: string; // Mode to open (e.g., "edit", "run", "builder")
  fileType: FileType; // The Salesforce metadata file type (e.g., Flow, Bot)
  metadataName: string; // Parsed developer name from the file path
  metadata: any; // Object returned by the metadata query
};

/**
 * Resolves the correct browser path for the given metadata context.
 * Delegates to metadata-specific resolution functions based on file type.
 *
 * @param ctx - Information about the metadata file and open request
 * @returns A Salesforce-relative path that can be used with `sf org open`
 */
export function resolveMetadataPath(ctx: PathContext): string {
  switch (ctx.fileType) {
    case FileType.Flow:
      return resolveFlowPath(ctx);

    case FileType.Bot:
      return resolveBotPath(ctx);

    default:
      throw new Error(`Unsupported FileType: ${ctx.fileType}`);
  }
}

/**
 * Resolves the browser path to open a Flow either in Flow Builder or Run Mode.
 *
 * @param ctx - Flow-specific context including ID and mode
 * @returns URL path for Flow Builder or Run Mode
 */
function resolveFlowPath(ctx: PathContext): string {
  const flowId = ctx.metadata?.Id;
  if (!flowId) throw new Error("Missing Flow ID");

  return ctx.mode === OpenMode.RUN
    ? `/flow/${ctx.metadataName}/${flowId}`
    : `/builder_platform_interaction/flowBuilder.app?flowId=${flowId}`;
}

/**
 * Resolves the browser path to open a Bot in either Agentforce Builder or Setup.
 *
 * @param ctx - Bot-specific context including bot/version IDs and mode
 * @returns URL path for Agentforce Builder or Setup
 */
function resolveBotPath(ctx: PathContext): string {
  const botId = ctx.metadata?.bot?.Id;
  const versionId = ctx.metadata?.version?.Id;
  if (!botId) throw new Error("Missing Bot ID");

  return ctx.mode === OpenMode.EDIT
    ? `/AiCopilot/copilotStudio.app#/copilot/builder?copilotId=${botId}&versionId=${versionId}`
    : `/lightning/setup/EinsteinCopilot/${botId}/edit`;
}


/**
 * Extracts the metadata developer name from .xml file name
 */
export function parseMetadataNameFromFilePath(
  filePath: string,
  fileType: FileType
): string {
  return path.basename(filePath).replace(fileType, "");
}