import { FileType } from "../../salesforce";
import { retrieveMetadata } from "./retriever";
import { Flow } from "..";

/**
 * Queries Salesforce to get the latest Flow version info by flow name
 */
export async function getMetadataInfo(
  metadataName: string,
  metadataType: FileType
): Promise<Flow | null> {
  return retrieveMetadata<Flow>({
    metadataName,
    metadataType,
    getCommand: (name) =>
      `sf data get record --use-tooling-api --sobject FlowDefinition --where "DeveloperName='${name}'" --json`,
    parseResult: (data) => {
      if (data?.result?.LatestVersionId) {
        return { Id: data.result.LatestVersionId };
      }
      return null;
    },
  });
}
