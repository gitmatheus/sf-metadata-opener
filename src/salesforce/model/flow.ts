import { Record } from "./standard";

/**
 * Interface representing the metadata of a Flow retrieved from Salesforce
 */
export interface Flow extends Record {
  ProcessType?: string;
}
