import * as vscode from "vscode";
import * as sf from "../../salesforce";

/**
 * Queries Salesforce to get the Dashboard metadata using the standard API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: sf.FileType,
  context: vscode.ExtensionContext
): Promise<sf.Dashboard | null> {
  const result = await sf.retrieve<sf.Dashboard>({
    metadataName,
    metadataType,
    getCommand: (name) =>
      `sf data get record --sobject Dashboard --where "DeveloperName='${name}'" --json`,
    parseResult: (data) => {
      const record = data?.result;
      if (record?.Id) {
        return {
          Id: record.Id,
          Name: record.Name,
          DeveloperName: record.DeveloperName,
          FolderName: record.FolderName,
        };
      }
      return null;
    },
    context,
  });

  return result;
}
