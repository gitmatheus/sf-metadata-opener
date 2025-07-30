import * as vscode from "vscode";
import { FileType } from "../../salesforce";
import { retrieve } from "./retriever";
import { ValidationRule } from "..";
import entities from "../../salesforce/model/entities.json";

/**
 * Queries Salesforce to get the Validation Rule metadata using the standard API.
 * Caches the record ID if caching is enabled.
 */
export async function getMetadataInfo(
  metadataName: string,
  metadataType: FileType,
  context: vscode.ExtensionContext,
  parentObjectName: string,
): Promise<ValidationRule | null> {
  const entityDefinitionId = await getEntityDefinitionIdFromName(parentObjectName, context);

  const result = await retrieve<ValidationRule>({
    metadataName,
    metadataType,
    getCommand: (name) => `
      sf data query --query "
        SELECT Id,
               FullName,
               ErrorMessage,
               Active,
               ValidationName,
               EntityDefinitionId, 
          FROM ValidationRule
         WHERE ValidationName = '${name}'
           AND (EntityDefinitionId = '${parentObjectName}' OR EntityDefinitionId = '${entityDefinitionId}')
         LIMIT 1" --json`,
    parseResult: (data) => {
      const record = data?.result;
      if (record?.Id) {
        return {
          Id: record.Id,
          FullName: record.FullName,
          ValidationName: metadataName,
          ParentObjectName: parentObjectName,
          EntityDefinitionId: record.EntityDefinitionId,
          ErrorMessage: record.ErrorMessage,
          Active: record.Active,
        };
      }
      return null;
    },
    context,
  });

  return result;
}

/**
 * Retrieves the EntityDefinitionId for a given object name.
 * For standard objects included in the static `entities.json`, this returns the name directly.
 * For custom objects or unknown cases, it queries the org for the actual EntityDefinition record ID.
 */
export async function getEntityDefinitionIdFromName(
  name: string,
  context: vscode.ExtensionContext
): Promise<string> {
  const isKnownStandard = entities.some(
    (entity) => entity.QualifiedApiName === name
  );

  if (isKnownStandard) {
    return name;
  }

  const result = await retrieve<string>({
    metadataName: name,
    metadataType: FileType.Other,
    context,
    getCommand: (qualifiedApiName) =>
      `sf data query --query "SELECT Id FROM EntityDefinition WHERE QualifiedApiName = '${qualifiedApiName}' LIMIT 1" --json`,
    parseResult: (data) => data?.result?.records?.[0]?.Id ?? null,
  });

  return result ?? name;
}