import * as sf from "../salesforce";
import * as utils from "../utils";
import { Properties } from "../properties";

/**
 * Builds a dynamic `sf org open` command to launch metadata in the browser.
 *
 * @param filePath - Full path to the local metadata file.
 * @param mode - Current mode (e.g., "edit", "run", "builder") used to determine behavior.
 * @param options - Configuration for how to process and resolve the metadata path.
 * @returns A CLI command string for opening the metadata in the browser, or null if data is missing.
 */
export async function buildOpenCommand<T>(
  filePath: string,
  mode: string,
  options: {
    cliMode: string; // e.g., "edit", "builder"
    metadataType: sf.FileType;
    fetchMetadata: (metadataName: string) => Promise<T | null>;
    getPathFromMetadata: (data: T, mode: string) => string;
  }
): Promise<string | null> {
  if (Properties.useSfCommandToOpenMetadata && mode === options.cliMode) {
    return sf.buildDefaultOpenCommand(filePath);
  }

  const metadataName = utils.parseMetadataNameFromFilePath(filePath, options.metadataType);
  const metadata = await options.fetchMetadata(metadataName);

  if (!metadata) return null;

  const path = options.getPathFromMetadata(metadata, mode);
  return `sf org open --path "${path}"`;
}
