import * as vscode from "vscode";
import * as path from "path";
import { FileType } from "../salesforce";

import * as bot from "../openers/bot/helpers";
import * as dashboard from "../openers/dashboard/helpers";
import * as flexipage from "../openers/flexipage/helpers";
import * as flow from "../openers/flow/helpers";
import * as report from "../openers/report/helpers";
import * as sobject from "../openers/sobject/helpers";
import * as validationRule from "../openers/validationRule/helpers";

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

// Defines the type signature for all metadata path resolver functions.
// Each resolver takes a PathContext and returns a Salesforce-relative browser URL.
type ResolverFn = (ctx: PathContext) => string;

const resolvePathMap: Record<FileType, ResolverFn> = {
  [FileType.Bot]: bot.resolvePath,
  [FileType.Dashboard]: dashboard.resolvePath,
  [FileType.FlexiPage]: flexipage.resolvePath,
  [FileType.Flow]: flow.resolvePath,
  [FileType.Report]: report.resolvePath,
  [FileType.SObject]: sobject.resolvePath,
  [FileType.ValidationRule]: validationRule.resolvePath,
  [FileType.Other]: () => {
    throw new Error("Unsupported metadata type for direct browser resolution.");
  },
};

/**
 * Resolves the correct browser path for the given metadata context.
 * Delegates to metadata-specific resolution functions based on file type.
 *
 * @param ctx - Information about the metadata file and open request
 * @returns A Salesforce-relative path that can be used with `sf org open`
 */
export function resolveMetadataPath(ctx: PathContext): string {
  const resolver = resolvePathMap[ctx.fileType];
  if (!resolver) {
    throw new Error(
      `Unsupported FileType: ${ctx.fileType}. Contact your developer so this new type can be supported (path).`
    );
  }
  return resolver(ctx);
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
