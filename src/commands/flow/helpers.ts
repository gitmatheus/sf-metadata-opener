import * as sf from "../../salesforce";
import * as utils from "../../utils";

/**
 * Mode in which the Flow will be opened
 */
export enum FlowOpenMode {
  RUN = "run",
  EDIT = "edit"
}

/**
 * Handles opening a Flow file (right-click or command palette)
 */
export async function openFlow(filePath: string, mode: FlowOpenMode): Promise<void> {
  if (!filePath.endsWith(".flow-meta.xml")) {
    utils.showWarningMessage(
      "The selected file is not a valid Flow metadata file (.flow-meta.xml)."
    );
    return;
  }

  const flowInfo = await sf.getLatestFlowInfo(filePath);

  if (!flowInfo?.Id) {
    utils.showErrorMessage("No Flow version found with that name.");
    return;
  }

  if (mode === FlowOpenMode.RUN) {
    // Validate if Run Mode is allowed
    if (!flowInfo.ProcessType || !sf.shouldOfferRunMode(flowInfo.ProcessType)) {
      utils.showWarningMessage(
        `⚠️ Run Mode is not supported for this Flow type: ${flowInfo.ProcessType || "Unknown"}`
      );
      return;
    }
  }

  const flowName = utils.parseFlowNameFromFilePath(filePath);
  const runPath =
    mode === FlowOpenMode.RUN
      ? `/flow/${flowName}/${flowInfo.Id}`
      : `/builder_platform_interaction/flowBuilder.app?flowId=${flowInfo.Id}`;

  const openCommand = `sf org open --path "${runPath}" --json`;

  try {
    await utils.runShellCommand(openCommand);
    const action = mode === FlowOpenMode.RUN ? "Run Mode" : "Flow Builder";
    utils.showInformationMessage(`✅ Opened Flow in ${action} via CLI`);
    
  } catch (error: any) {
    utils.showErrorMessage(`Failed to open Flow via CLI: ${error.message}`);
  }
}