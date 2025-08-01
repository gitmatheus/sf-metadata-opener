import * as vscode from "vscode";
import * as sf from "../../salesforce";

/**
 * Queries Salesforce to get the latest Flow version info by flow name.
 * This function supports optional caching if enabled by the user.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: sf.FileType,
  context: vscode.ExtensionContext
): Promise<sf.Flow | null> {
  const result = await sf.retrieve<sf.Flow>({
    metadataName,
    metadataType,
    context,
    skipCacheCheck: true, // Always fetch live data
    getCommand: (name) =>
      `sf data get record --use-tooling-api --sobject FlowDefinition --where "DeveloperName='${name}'" --json`,
    parseResult: (data) => {
      if (data?.result?.LatestVersionId) {
        return { Id: data.result.LatestVersionId };
      }
      return null;
    },    
  });

  return result;
}
