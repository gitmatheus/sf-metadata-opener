import * as vscode from "vscode";
import { FileType, stripSalesforceSuffix } from "../../salesforce";
import { retrieve } from "../../salesforce/data/retriever";
import { SObject } from "../../salesforce";

/**
 * Queries Salesforce to get the SObject metadata using Tooling API.
 * Caches the record ID if caching is enabled.
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: FileType,
  context: vscode.ExtensionContext,
): Promise<SObject | null> {
  const result = await retrieve<SObject>({
    metadataName,
    metadataType,
    getCommand: (name) => `sf data get record --use-tooling-api --sobject CustomObject --where "DeveloperName='${name}'" --json`,
    parseResult: (data) => {
      const record = data?.result?.records?.[0];
      if (record?.Id) {
        return {
          Id: record.Id,
          DeveloperName: record.DeveloperName,
          NamespacePrefix: record.NamespacePrefix,
        };
      }
      return null;
    },
    context,
  });

  return result;
}