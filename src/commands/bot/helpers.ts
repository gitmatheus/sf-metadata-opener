import * as metadata from "../../salesforce/data/bot";
import * as handlers from "../handlers";
import * as utils from "../../utils";
import { FileType } from "../../salesforce";
import { createOpenCommand, OpenMode } from "../factory";

/**
 * Handles opening a Bot file from right-click or command palette.
 */
export async function open(filePath: string, mode: OpenMode): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: FileType.Bot,
    buildOpenCommand: (filePath, mode) =>
      createOpenCommand(filePath, mode as OpenMode, {
        metadataType: FileType.Bot,
        fetchMetadata: metadata.getMetadataInfo,
      }),
  });
}

/**
 * Resolves the browser path to open a Bot in Agentforce Builder or Setup.
 */
export function resolvePath(ctx: utils.PathContext): string {
  const botId = ctx.metadata?.bot?.Id;
  const versionId = ctx.metadata?.version?.Id;
  if (!botId) throw new Error("Missing Bot ID");

  return ctx.mode === OpenMode.EDIT
    ? `/AiCopilot/copilotStudio.app#/copilot/builder?copilotId=${botId}&versionId=${versionId}`
    : `/lightning/setup/EinsteinCopilot/${botId}/edit`;
}