import * as path from 'path';
import {
  Extensions,
  ExtensionType
} from "../salesforce/model/fileExtensions";

/**
 * Convenience function to extract the Flow developer name from .xml file name
 */
export function parseFlowNameFromFilePath(filePath: string): string {
  return parseMetadataNameFromFilePath(filePath, Extensions.Flow);
}

/**
 * Convenience function to extract the Bot (Agentforce agent) developer name from .xml file name
 */
export function parseBotNameFromFilePath(filePath: string): string {
  return parseMetadataNameFromFilePath(filePath, Extensions.Bot);
}

/**
 * Extracts the metadata developer name from .xml file name
 */
export function parseMetadataNameFromFilePath(filePath: string, fileType: ExtensionType): string {
  return path.basename(filePath).replace(fileType, '');
}