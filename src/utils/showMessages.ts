import * as vscode from "vscode";
import * as constants from "../constants";

export enum MessageType {
  ERROR = "error",
  INFORMATION = "info",
  WARNING = "warning",
}

const outputChannel = vscode.window.createOutputChannel(
  constants.OUTPUT_CHANNEL_NAME
);

/**
 * Shows an informational message to the user and add it to the output channel
 */
export function showInformationMessage(message: string): void {
  showMessage(message, MessageType.INFORMATION);
}

/**
 * Shows an error message to the user and add it to the output channel
 */
export function showErrorMessage(message: string): void {
  showMessage(message, MessageType.ERROR);
}

/**
 * Shows a warning message to the user and add it to the output channel
 */
export function showWarningMessage(message: string): void {
  showMessage(message, MessageType.WARNING);
}

/**
 * Appends lines to the output channel,
 * and shows the provided message to the user
 */
function showMessage(message: string, type: MessageType): void {
  outputChannel.appendLine(message);

  if (type === MessageType.ERROR) {
    vscode.window.showErrorMessage(message);
  } else if (type === MessageType.WARNING) {
    vscode.window.showWarningMessage(message);
  } else {
    // Default to information message
    vscode.window.showInformationMessage(message);
  }
}
