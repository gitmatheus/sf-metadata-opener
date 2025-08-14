import * as vscode from "vscode";
import * as sf from "../../salesforce";

/**
 * Queries Salesforce to get the Record Type metadata using Tooling API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: sf.FileType,
  context: vscode.ExtensionContext,
  sobjectType: string,
  fetchEntityDefinitionId: boolean
): Promise<sf.RecordType | null> {
  const result = await sf.retrieve<sf.RecordType>({
    metadataName,
    metadataType,
    parentKey: sobjectType,
    getCommand: (name) => `
      sf data query --query "
        SELECT Id, DeveloperName, SobjectType, IsActive, BusinessProcessId
          FROM RecordType
         WHERE SobjectType = '${sobjectType}'
           AND DeveloperName = '${name}'
         LIMIT 1" --json`,
    parseResult: (data) => {
      const record = data?.result?.records?.[0];
      if (record?.Id) {
        return {
          Id: record.Id,
          DeveloperName: record.DeveloperName,
          SobjectType: record.SobjectType,
          IsActive: record.IsActive,
          BusinessProcessId: record.BusinessProcessId,
        };
      }
      return null;
    },
    context,
  });

  if (!result || !fetchEntityDefinitionId) return result;

  // Only for edit mode — resolve parent object's EntityDefinition.Id
  const entity = await sf.retrieve<{ Id: string } & sf.MetadataRecord>({
    metadataName: `EntityDefinitionId:${sobjectType}`,
    metadataType,
    parentKey: sobjectType,
    getCommand: () => `
      sf data query --use-tooling-api --query "
        SELECT DurableId
          FROM EntityDefinition
         WHERE QualifiedApiName = '${sobjectType}'
         LIMIT 1" --json`,
    parseResult: (data) => {
      const record = data?.result?.records?.[0];
      return record?.DurableId ? { Id: record.DurableId } : null;
    },
    context,
  });

  if (!entity) return null;
  return { ...result, EntityDefinitionId: entity?.Id };
}
