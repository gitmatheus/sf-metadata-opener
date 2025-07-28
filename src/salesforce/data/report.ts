import { FileType } from "../../salesforce";
import { retrieveMetadata } from "./retriever";
import { Report } from "..";

/**
 * Queries Salesforce to get the Report metadata using the standard API.
 */
export async function getMetadataInfo(
  metadataName: string,
  metadataType: FileType
): Promise<Report | null> {
  return retrieveMetadata<Report>({
    metadataName,
    metadataType,
    getCommand: (name) =>
      `sf data get record --sobject Report --where "DeveloperName='${name}'" --json`,    
    parseResult: (data) => {
      const result = data?.result;
      if (result?.Id) {
        return {
            Id: result.Id,
            Name: result.Name,
            DeveloperName: result.DeveloperName,
            FolderName: result.FolderName,
            Format: result.Format,
          };
      }
      return null;
    },
  });
}
