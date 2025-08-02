import * as vscode from "vscode";
import * as sf from "../../salesforce";

/**
 * Queries Salesforce to get the FlexiPage metadata using Tooling API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: sf.FileType,
  context: vscode.ExtensionContext
): Promise<sf.FlexiPage | null> {
  const result = await sf.retrieve<sf.FlexiPage>({
    metadataName,
    metadataType,
    getCommand: (name) => `
      sf data query --use-tooling-api --query "
        SELECT Id,
               DeveloperName,
               MasterLabel,
               Description, 
               EntityDefinitionId,
               ParentFlexiPage
          FROM FlexiPage
         WHERE DeveloperName = '${name}'
         LIMIT 1" --json`,
    parseResult: (data) => {
      const record = data?.result?.records?.[0];
      if (record?.Id) {
        return {
          Id: record.Id,
          DeveloperName: record.DeveloperName,
          MasterLabel: record.MasterLabel,
          Description: record.Description,
          EntityDefinitionId: record.EntityDefinitionId,
          ParentFlexiPage: record.ParentFlexiPage,
        };
      }
      return null;
    },
    context,
  });

  return result;
}
