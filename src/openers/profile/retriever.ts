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
      `sf data get record --sobject Profile --where "Name='${name}'" --json`,
    parseResult: (data) => {
      const record = data?.result;
      if (record?.Id) {
        return {
          Id: record.Id,
          Name: record.Name,
          UserLicenseId: record.UserLicenseId,
          UserType: record.UserType,
          PermissionsPermissionName: record.PermissionsPermissionName,
        };
      }
      return null;
    },
    context,
  });
}
