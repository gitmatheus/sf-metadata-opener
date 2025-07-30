import { FileType } from "../../salesforce";
import { retrieveMetadata } from "./retriever";
import { Dashboard } from "..";

/**
 * Queries Salesforce to get the Dashboard metadata using the standard API.
 */
export async function getMetadataInfo(
  metadataName: string,
  metadataType: FileType
): Promise<Dashboard | null> {
  return retrieveMetadata<Dashboard>({
    metadataName,
    metadataType,
    getCommand: (name) =>
      `sf data get record --sobject Dashboard --where "DeveloperName='${name}'" --json`,    
    parseResult: (data) => {
      const result = data?.result;
      if (result?.Id) {
        return {
            Id: result.Id,
            Name: result.Name,
            DeveloperName: result.DeveloperName,
            FolderName: result.FolderName,
          };
      }
      return null;
    },
  });
}
