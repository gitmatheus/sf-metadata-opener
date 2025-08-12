import * as vscode from "vscode";
import { FileType, Profile } from "../../salesforce";
import { retrieve } from "../../salesforce/data/service";

/**
 * Queries Salesforce to get the Profile metadata using the standard API.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: FileType,
  context: vscode.ExtensionContext
): Promise<Profile | null> {
  return retrieve<Profile>({
    metadataName,
    metadataType,
    getCommand: (name) =>
      `sf data query --query "
        SELECT Id, 
               Name, 
               UserLicenseId, 
               UserType 
          FROM Profile 
         WHERE Name = '${name}' 
         LIMIT 1" --json`,
    parseResult: (data) => {
      const record = data?.result?.records?.[0];
      if (record?.Id) {
        return {
          Id: record.Id,
          Name: record.Name,
          UserLicenseId: record.UserLicenseId,
          UserType: record.UserType,
        };
      }
      return null;
    },
    context,
  });
}
