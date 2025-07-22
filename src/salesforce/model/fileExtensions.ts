/**
 * File extensions for Salesforce metadata types supported by the extension.
 */
export const Extensions = {
  Flow: ".flow-meta.xml",
  Bot: ".bot-meta.xml",
};

/**
 * Metadata extension type for better type safety
 */
export type ExtensionType = (typeof Extensions)[keyof typeof Extensions];

/**
 * All supported metadata extensions (for filtering, validation, etc.)
 */
export const SUPPORTED_EXTENSIONS = Object.values(Extensions);
