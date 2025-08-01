import * as vscode from "vscode";
import * as sf from "../../salesforce";

/**
 * Queries Salesforce to get the Report metadata using the standard API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: sf.FileType,
  context: vscode.ExtensionContext
): Promise<sf.Report | null> {
  const result = await sf.retrieve<sf.Report>({
    metadataName,
    metadataType,
    getCommand: (name) =>
      `sf data get record --sobject Report --where "DeveloperName='${name}'" --json`,
    parseResult: (data) => {
      const record = data?.result;
      if (record?.Id) {
        return {
          Id: record.Id,
          Name: record.Name,
          DeveloperName: record.DeveloperName,
          FolderName: record.FolderName,
          Format: record.Format,
        };
      }
      return null;
    },
    context,
  });

  return result;
}
