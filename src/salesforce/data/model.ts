/**
 * File extensions for Salesforce metadata types supported by the extension.
 */
export const FileType = {
  Bot: ".bot-meta.xml",
  Dashboard: ".dashboard-meta.xml",
  FlexiPage: ".flexipage-meta.xml",
  Flow: ".flow-meta.xml",
  Other: ".other-meta.xml",
  PermissionSet: ".permissionset-meta.xml",
  Report: ".report-meta.xml",
  SObject: ".object-meta.xml",
  ValidationRule: ".validationRule-meta.xml",
};

/**
 * Metadata extension type for better type safety
 */
export type FileType = (typeof FileType)[keyof typeof FileType];

/**
 * Human-readable labels for each metadata type.
 */
export const MetadataLabels: Record<FileType, string> = {
  [FileType.Bot]: "Agentforce Agent (Bot)",
  [FileType.Dashboard]: "Dashboard",
  [FileType.FlexiPage]: "FlexiPage",
  [FileType.Flow]: "Flow",
  [FileType.Other]: "Metadata",
  [FileType.PermissionSet]: "Permission Set",
  [FileType.Report]: "Report",
  [FileType.SObject]: "Object",
  [FileType.ValidationRule]: "Validation Rule",
};

/**
 * Maps config keys (from user settings) to internal FileType values.
 */
export const DeployableMetadataKeys: Record<string, FileType> = {
  Bot: FileType.Bot,
  Dashboard: FileType.Dashboard,
  FlexiPage: FileType.FlexiPage,
  Flow: FileType.Flow,
  PermissionSet: FileType.PermissionSet,
  Report: FileType.Report,
  SObject: FileType.SObject,
  ValidationRule: FileType.ValidationRule,
};

/**
 * Interface representing the metadata of a record retrieved from Salesforce
 */
export interface MetadataRecord {
  Id?: string;
  Name?: string;
}

/**
 * Interface representing the metadata of a Bot (Agentforce Agent) retrieved from Salesforce,
 * including its associated versions (via subquery).
 */
export interface Bot extends MetadataRecord {
  DeveloperName?: string;
  MasterLabel?: string;
  BotVersions?: {
    records?: BotVersion[];
  };
}

/**
 * Compound metadata type for Bot + Version
 */
export interface BotMetadataWrapper {
  bot: Bot;
  version: BotVersion;
}

/**
 * Interface representing the metadata of a Bot (Agentforce Agent) version retrieved from Salesforce
 */
export interface BotVersion extends MetadataRecord {
  Status?: string;
  VersionNumber?: number;
}

/**
 * Interface representing the metadata of a Dashboard retrieved from Salesforce
 */
export interface Dashboard extends MetadataRecord {
  DeveloperName?: string;
  FolderName?: string;
}

/**
 * Interface representing the metadata of a FlexiPage retrieved from Salesforce
 */
export interface FlexiPage extends MetadataRecord {
  Description?: string;
  DeveloperName?: string;
  EntityDefinitionId?: string;
  MasterLabel?: string;
  ParentFlexiPage?: string;
}

/**
 * Interface representing the metadata of a Flow retrieved from Salesforce
 */
export interface Flow extends MetadataRecord {
  ProcessType?: string;
}

/**
 * Interface representing the metadata of a PermissionSet retrieved from Salesforce
 */
export interface PermissionSet extends MetadataRecord {
  Label?: string;
  Description?: string;
  IsCustom?: boolean;
}

/**
 * Interface representing the metadata of an Object retrieved from Salesforce
 */
export interface SObject extends MetadataRecord {
  DeveloperName?: string;
  NamespacePrefix?: string;
  isCustom?: boolean;
}

/**
 * Interface representing the metadata of a Report retrieved from Salesforce
 */
export interface Report extends MetadataRecord {
  DeveloperName?: string;
  FolderName?: string;
  Format?: string;
}

/**
 * Interface representing the metadata of a Validation Rule retrieved from Salesforce
 */
export interface ValidationRule extends MetadataRecord {
  FullName: string;
  ValidationName?: string;
  EntityDefinitionId?: string;
  ErrorMessage?: string;
  Active?: boolean;
  ParentObjectName?: string;
}

/**
 * All supported metadata extensions (for filtering, validation, etc.)
 */
export const SUPPORTED_EXTENSIONS = Object.values(FileType);
