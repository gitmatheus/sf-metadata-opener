export const EXTENSION_TITLE = 'Salesforce Metadata Opener';
export const OUTPUT_CHANNEL_NAME = EXTENSION_TITLE + ": Output Channel";

/**
 * Map of Salesforce custom suffixes by type
 */
export const SOBJECT_CUSTOM_SUFFIXES: Record<string, string> = {
  "__xo": "Salesforce-to-Salesforce (S2S)",
  "__x": "External Object",
  "__voteStat": "Article Rating",
  "__viewStat": "Article View Count",
  "__Tag": "Salesforce Tags",
  "__share": "Sharing Object",
  "__Street__s": "Custom Address Street",
  "__StateCode__s": "Custom Address State Code",
  "__r": "Custom Relationship",
  "__PostalCode__s": "Custom Address Postal Code",
  "__pc": "Custom Persona Account Field",
  "__mdt": "Custom Metadata Type",
  "__longitude__s": "Longitude Coordinate",
  "__latitude__s": "Latitude Coordinate",
  "__kav": "Knowledge Article Version",
  "__history": "Field History",
  "__GeocodeAccuracy__s": "Custom Address Geocode Accuracy",
  "__e": "Platform Event",
  "__dlm": "Customer Data Platform Model",
  "__CountryCode__s": "Custom Address Country Code",
  "__c": "Custom Object / Field",
  "__chn": "Change Event Channel",
  "__City__s": "Custom Address City",
  "__ChangeEvent": "Change Data Capture",
  "__b": "Custom Big Object"
};