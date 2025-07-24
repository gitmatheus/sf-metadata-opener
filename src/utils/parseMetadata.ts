import * as path from "path";
import { FileType } from "../salesforce/model";

/**
 * Extracts the metadata developer name from .xml file name
 */
export function parseMetadataNameFromFilePath(
  filePath: string,
  fileType: FileType
): string {
  return path.basename(filePath).replace(fileType, "");
}
