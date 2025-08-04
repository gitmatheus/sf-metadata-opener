import * as vscode from "vscode";
import { FileType } from "../../salesforce";
import { retrieve } from "../../salesforce/data/service";
import { PermissionSet } from "../../salesforce";

/**
 * Queries Salesforce to get the Permission Set metadata using the standard API.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: FileType,
  context: vscode.ExtensionContext
): Promise<PermissionSet | null> {
  const result = await retrieve<PermissionSet>({
    metadataName,
    metadataType,
    getCommand: (name) =>
      `sf data get record --sobject PermissionSet --where "Name='${name}'" --json`,
    parseResult: (data) => {
      const record = data?.result;
      if (record?.Id) {
        return {
          Id: record.Id,
          Name: record.Name,
          Label: record.Label,
          Description: record.Description,
        };
      }
      return null;
    },
    context,
  });

  return result;
}
