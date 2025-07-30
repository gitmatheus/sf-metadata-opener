import * as vscode from "vscode";
import * as path from "path";
import { FileType } from "../salesforce";

import * as flow from "../commands/flow/helpers";
import * as bot from "../commands/bot/helpers";
import * as report from "../commands/report/helpers";
import * as dashboard from "../commands/dashboard/helpers";

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
      return flow.resolvePath(ctx);

    case FileType.Bot:
      return bot.resolvePath(ctx);

    case FileType.Report:
      return report.resolvePath(ctx);

      case FileType.Dashboard:
      return dashboard.resolvePath(ctx);

    default:
      throw new Error(
        `Unsupported FileType: ${ctx.fileType}. Contact your developer so this new type can be supported (path).`
      );
  }
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
