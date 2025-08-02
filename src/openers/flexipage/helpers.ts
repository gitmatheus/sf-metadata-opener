import * as vscode from "vscode";
import * as retriever from "./retriever";
import * as handlers from "../handlers";
import * as utils from "../../utils";
import * as sf from "../../salesforce";
import * as factory from "../factory";

/**
 * Registers the open handlers for the extension context
 */
export function registerHandlers(context: vscode.ExtensionContext) {
  return handlers.registerHandlers(open, context);
}

/**
 * Handles opening a FlexiPage from right-click or command palette.
 */
export async function open(
  filePath: string,
  mode: factory.OpenMode,
  context: vscode.ExtensionContext
): Promise<void> {
  return handlers.openMetadata({
    filePath,
    mode,
    fileType: sf.FileType.FlexiPage,
    buildOpenCommand: getOpenCommandBuilder(context),
  });
}

/**
 * Returns a function that builds the open command for this opener
 */
function getOpenCommandBuilder(context: vscode.ExtensionContext) {
  return async (filePath: string, mode: factory.OpenMode) => {
    return factory.createOpenCommand(
      filePath,
      mode,
      {
        metadataType: sf.FileType.FlexiPage,
        fetchMetadata: retriever.retrieveRecord,
        canUseOpenFileCommand: true, // FlexiPages can use the default open file sf command
      },
      context
    );
  };
}

/**
 * Returns the standard view URL for a FlexiPage in Setup.
 * Example: /lightning/setup/FlexiPageList/page?address=/0M0xxxxxxx
 */
export function buildFlexiPageViewUrl(id: string): string {
  return `/lightning/setup/FlexiPageList/page?address=%2F${id}`;
}

/**
 * Builds the editable Lightning App Builder URL for a FlexiPage,
 * with the return URL set to its view page
 */
export function buildFlexiPageEditUrl(id: string): string {
  const retUrl = encodeURIComponent(buildFlexiPageViewUrl(id));
  return `/visualEditor/appBuilder.app?id=${id}&clone=false&retUrl=${retUrl}`;
}

/**
 * Resolves the correct Lightning path for a FlexiPage depending on mode
 */
export function resolvePath(ctx: utils.PathContext): string {
  const record = ctx.metadata as sf.FlexiPage;
  const id = record?.Id;

  if (!id) {
    throw new Error("Missing FlexiPage Id.");
  }

  return ctx.mode === factory.OpenMode.EDIT
    ? buildFlexiPageEditUrl(id)
    : buildFlexiPageViewUrl(id);
}
