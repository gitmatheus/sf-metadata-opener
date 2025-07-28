import * as metadata from "../../salesforce/data/bot";
import * as handlers from "../handlers";
import { FileType } from "../../salesforce";
import { createOpenCommand, OpenMode } from "../factory";

/**
 * Handles opening a record from right-click or command palette.
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
