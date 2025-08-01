import * as vscode from "vscode";
import * as sf from "../../salesforce";

/**
 * Queries Salesforce to get the SObject metadata using Tooling API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: sf.FileType,
  context: vscode.ExtensionContext
): Promise<sf.SObject | null> {
  // If this is a Standard SObject, we just need to return its name
  if (sf.isStandardSObject(metadataName)) {
    return {
      DeveloperName: metadataName,
      isCustom: false,
    } as sf.SObject;
  }

  // For custom objects, we need to nomalize the API Name
  const normalizedMetadataName = sf.normalizeSObjectName(metadataName);

  const result = await sf.retrieve<sf.SObject>({
    metadataName: normalizedMetadataName,
    metadataType,
    getCommand: (name) => `
      sf data query --use-tooling-api --query "
        SELECT Id,
               DeveloperName,
               NamespacePrefix
          FROM CustomObject
         WHERE DeveloperName = '${name}'
         LIMIT 1" --json`,
    parseResult: (data) => {
      const record = data?.result?.records?.[0];
      if (record?.Id) {
        return {
          Id: record.Id,
          DeveloperName: record.DeveloperName,
          NamespacePrefix: record.NamespacePrefix,
          isCustom: true,
        };
      }
      return null;
    },
    context,
  });

  return result;
}
