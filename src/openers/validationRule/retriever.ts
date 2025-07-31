import * as vscode from "vscode";
import { FileType, stripSalesforceSuffix } from "../../salesforce";
import { retrieve } from "../../salesforce/data/retriever";
import { ValidationRule } from "../../salesforce";

/**
 * Queries Salesforce to get the Validation Rule metadata using Tooling API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: FileType,
  context: vscode.ExtensionContext,
  parentObjectName: string
): Promise<ValidationRule | null> {
  // Ensure the parent object name is stripped of any Salesforce suffixes
  const entityDefinitionName = stripSalesforceSuffix(parentObjectName);
  const result = await retrieve<ValidationRule>({
    metadataName,
    metadataType,
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