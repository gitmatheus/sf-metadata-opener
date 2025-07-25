import { FileType } from "../../salesforce";
import { retrieveMetadata } from "./retriever";
import { Bot, BotVersion } from "..";

/**
 * Retrieves the BotDefinition and latest BotVersion from Salesforce for the given bot name.
 */
export async function getMetadataInfo(
  metadataName: string,
  metadataType: FileType
): Promise<{ bot: Bot; version: BotVersion } | null> {
  return retrieveMetadata<{ bot: Bot; version: BotVersion }>({
    metadataName,
    metadataType,
    getCommand: (name) => `
      sf data query --query "
        SELECT Id, 
               DeveloperName, 
               MasterLabel,
               (SELECT Id, 
                      Status, 
                      VersionNumber 
                 FROM BotVersions 
                ORDER BY VersionNumber 
                 DESC LIMIT 1)
        FROM BotDefinition
       WHERE DeveloperName = '${name}' AND IsDeleted = false
       LIMIT 1" --json`,

    parseResult: (data) => {
      const bot: Bot | undefined = data?.result?.records?.[0];
      const version: BotVersion | undefined = bot?.BotVersions?.records?.[0];
      return bot?.Id && version?.Id ? { bot, version } : null;
    },
  });
}
