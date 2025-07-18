import * as vscode from "vscode";
import * as sf from "../salesforce";
import * as utils from "../utils";

/**
 * Opens the Flow in Run Mode, if applicable
 */
export async function openFlowInRunMode(uri: vscode.Uri) {
  try {
    const flowName = utils.parseFlowNameFromFilePath(uri.fsPath);
    const flowInfo: sf.Flow | null = await sf.getLatestFlowInfo(flowName);

    // Return early if flowInfo is null or missing required properties
    if (!flowInfo || !flowInfo.Id || !flowInfo.ProcessType) {
      return;
    }

    if (!sf.shouldOfferRunMode(flowInfo.ProcessType)) {
      utils.showWarningMessage(
        `Flow type "${flowInfo.ProcessType}" does not support Run Mode.`
      );
      return;
    }

    const domain = await sf.getOrgDomain();
    const vfDomain = domain.replace(
      ".my.salesforce.com",
      "--c.visual.force.com"
    );
    const url = `${vfDomain}/flow/${flowName}/${flowInfo.Id}`;

    vscode.env.openExternal(vscode.Uri.parse(url));
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow in Run Mode: ${error.message}`);
  }
}
