import * as vscode from "vscode";
import { open } from "./helpers";
import { registerOpenHandlers } from "../handlers";

export * from "./helpers";

// Export the handlers
export function registerHandlers(context: vscode.ExtensionContext) {
  const handlers = registerOpenHandlers(open, context);
  return {
    openInEditMode: handlers.inEditMode,
    openInViewMode: handlers.inViewMode,
    openFileInEditMode: handlers.currentInEditMode,
    openFileInViewMode: handlers.currentInViewMode,
  };
}