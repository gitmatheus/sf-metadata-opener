import * as vscode from "vscode";
import { open } from "./helpers";
import { registerOpenHandlers } from "../handlers";

export function registerHandlers(context: vscode.ExtensionContext) {  
  const handlers = registerOpenHandlers(open, context);
  return {
    openInEditMode: handlers.inEditMode,
    openInRunMode: handlers.inRunMode,
    openFileInEditMode: handlers.currentInEditMode,
    openFileInRunMode: handlers.currentInRunMode,
  };
}
