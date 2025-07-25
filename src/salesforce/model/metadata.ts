/**
 * File extensions for Salesforce metadata types supported by the extension.
 */
export const FileType = {
  Flow: ".flow-meta.xml",
  Bot: ".bot-meta.xml",
};


/**
 * Human-readable labels for each metadata type.
 */
export const MetadataLabels: Record<FileType, string> = {
  [FileType.Flow]: "Flow",
  [FileType.Bot]: "Agentforce Agent (Bot)",
};

/**
 * Interface representing the metadata of a record retrieved from Salesforce
 */
export interface Metadata {
  Id?: string;
  Name?: string;
}

/**
 * Interface representing the metadata of a Flow retrieved from Salesforce
 */
export interface Flow extends Metadata {
  ProcessType?: string;
}

/**
 * Interface representing the metadata of a Bot (Agentforce Agent) version retrieved from Salesforce
 */
export interface BotVersion extends Metadata {
  Status?: string;
  VersionNumber?: number;
}

/**
 * Interface representing the metadata of a Bot (Agentforce Agent) retrieved from Salesforce,
 * including its associated versions (via subquery).
 */
export interface Bot extends Metadata {
  DeveloperName?: string;
  MasterLabel?: string;
  BotVersions?: {
    records?: BotVersion[];
  };
}


/**
 * Metadata extension type for better type safety
 */
export type FileType = (typeof FileType)[keyof typeof FileType];

/**
 * All supported metadata extensions (for filtering, validation, etc.)
 */
export const SUPPORTED_EXTENSIONS = Object.values(FileType);
