import * as path from 'path';

/**
 * Extracts the Flow developer name from .flow-meta.xml file name
 */
export function parseFlowNameFromFilePath(filePath: string): string {
  return path.basename(filePath).replace('.flow-meta.xml', '');
}
