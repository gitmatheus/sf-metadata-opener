/**
 * File extensions for Salesforce metadata types supported by the extension.
 */
export const FileType = {
  Flow: ".flow-meta.xml",
  Bot: ".bot-meta.xml",
  Report: ".report-meta.xml",
  Dashboard: ".dashboard-meta.xml",
};

/**
 * Human-readable labels for each metadata type.
 */
export const MetadataLabels: Record<FileType, string> = {
  [FileType.Flow]: "Flow",
  [FileType.Bot]: "Agentforce Agent (Bot)",
  [FileType.Report]: "Report",
  [FileType.Dashboard]: "Dashboard",
};

/**
 * Interface representing the metadata of a record retrieved from Salesforce
 */
export interface Metadata {
  Id?: string;
  Name?: string;
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
 * Interface representing the metadata of a Bot (Agentforce Agent) version retrieved from Salesforce
 */
export interface BotVersion extends Metadata {
  Status?: string;
  VersionNumber?: number;
}

/**
 * Compound metadata type for Bot + Version
 */
export interface BotMetadataWrapper {
  bot: Bot;
  version: BotVersion;
}

/**
 * Interface representing the metadata of a Flow retrieved from Salesforce
 */
export interface Flow extends Metadata {
  ProcessType?: string;
}

/**
 * Interface representing the metadata of a Report retrieved from Salesforce
 */
export interface Report extends Metadata {
  DeveloperName?: string;
  FolderName?: string;
  Format?: string;
}

/**
 * Interface representing the metadata of a Dashboard retrieved from Salesforce
 */
export interface Dashboard extends Metadata {
  DeveloperName?: string;
  FolderName?: string;
}

/**
 * Metadata extension type for better type safety
 */
export type FileType = (typeof FileType)[keyof typeof FileType];

/**
 * All supported metadata extensions (for filtering, validation, etc.)
 */
export const SUPPORTED_EXTENSIONS = Object.values(FileType);
