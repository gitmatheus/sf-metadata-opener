import { Record } from "./standard";

/**
 * Interface representing the metadata of a Bot (Agentforce Agent) version retrieved from Salesforce
 */
export interface BotVersion extends Record {
  Status?: string;
  VersionNumber?: number;
}

/**
 * Interface representing the metadata of a Bot (Agentforce Agent) retrieved from Salesforce,
 * including its associated versions (via subquery).
 */
export interface Bot extends Record {
  DeveloperName?: string;
  MasterLabel?: string;
  BotVersions?: {
    records?: BotVersion[];
  };
}
