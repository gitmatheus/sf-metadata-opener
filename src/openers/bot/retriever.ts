import * as vscode from "vscode";
import * as sf from "../../salesforce";

/**
 * Retrieves the BotDefinition and latest BotVersion from Salesforce for the given bot name.
 * Always queries the org live (no caching).
 */
export async function retrieveRecord(
  metadataName: string,
  metadataType: sf.FileType,
  context: vscode.ExtensionContext
): Promise<sf.BotMetadataWrapper | null> {
  return sf.retrieve<sf.BotMetadataWrapper>({
    metadataName,
    metadataType,
    context,
    skipCacheCheck: true, // Always fetch live data
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
       WHERE DeveloperName = '${name}' 
         AND IsDeleted = false
       LIMIT 1" --json`,
    parseResult: (data) => {
      const bot: sf.Bot | undefined = data?.result?.records?.[0];
      const version: sf.BotVersion | undefined = bot?.BotVersions?.records?.[0];
      return bot?.Id && version?.Id ? { bot, version } : null;
    },
  });
}
