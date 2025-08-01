import * as vscode from "vscode";
import { FileType } from "../../salesforce";
import { retrieve } from "../../salesforce/data/service";
import { Dashboard } from "../../salesforce";

/**
 * Queries Salesforce to get the Dashboard metadata using the standard API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: FileType,
  context: vscode.ExtensionContext
): Promise<Dashboard | null> {
  const result = await retrieve<Dashboard>({
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
