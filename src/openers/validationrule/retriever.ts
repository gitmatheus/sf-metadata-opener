import * as vscode from "vscode";
import * as sf from "../../salesforce";

/**
 * Queries Salesforce to get the Validation Rule metadata using Tooling API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: sf.FileType,
  context: vscode.ExtensionContext,
  parentObjectName: string
): Promise<sf.ValidationRule | null> {
  // Ensure the parent object name is stripped of any Salesforce suffixes
  const entityDefinitionName = sf.normalizeSObjectName(parentObjectName);
  const result = await sf.retrieve<sf.ValidationRule>({
    metadataName,
    metadataType,
    parentKey: parentObjectName, // used for caching
    getCommand: (name) => `
      sf data query --use-tooling-api --query "
        SELECT Id,
               FullName,
               ErrorMessage,
               Active,
               ValidationName,
               EntityDefinitionId 
          FROM ValidationRule
         WHERE ValidationName = '${name}'
           AND (EntityDefinitionId = '${parentObjectName}' OR EntityDefinition.DeveloperName = '${entityDefinitionName}')
         LIMIT 1" --json`,
    parseResult: (data) => {
      const record = data?.result?.records?.[0];
      if (record?.Id) {
        return {
          Id: record.Id,
          FullName: record.FullName,
          ValidationName: metadataName,
          ParentObjectName: parentObjectName,
          EntityDefinitionId: record.EntityDefinitionId,
        };
      }
      return null;
    },
    context,
  });

  return result;
}
