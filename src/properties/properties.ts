import * as vscode from "vscode";

const EXTENSION_CONFIG_NAME = "SalesforceMetadataOpener";

/**
 * Centralized access to extension settings.
 *
 * Provides typed access to user-defined configuration values declared in package.json,
 * and includes support for cached and live reloading of settings via `refresh()`.
 *
 * Use this class to check feature toggles and user preferences at runtime.
 */
export class Properties {
  private static extensionConfig = vscode.workspace.getConfiguration(
    EXTENSION_CONFIG_NAME
  );

  /**
   * Returns the list of metadata types that should be auto-deployed before opening.
   * Matches against human-readable type labels (e.g., "Flow", "ValidationRule").
   */
  static get deployableMetadataTypes(): string[] {
    return this.extensionConfig.get<string[]>("deployableMetadataTypes", []);
  }

  /**
   * Whether to use the `sf` CLI to open metadata directly.
   * If disabled, the extension will query the org to resolve the record ID.
   */
  static get useOpenFileCommand(): boolean {
    return this.extensionConfig.get<boolean>(
      "useOpenFileCommandToOpenMetadata",
      true
    );
  }

  /**
   * Returns the list of metadata types that should use `sf org open --source-file`,
   * as defined by the user's current settings.
   */
  static get openFileSupportedMetadataTypes(): string[] {
    return this.extensionConfig.get<string[]>(
      "openFileSupportedMetadataTypes",
      []
    );
  }

  /**
   * Returns whether caching of record IDs is enabled.
   * This helps avoid repeated queries for the same metadata.
   */
  static get enableCaching(): boolean {
    return this.extensionConfig.get<boolean>("enableCaching", false);
  }

  static refresh(): void {
    this.extensionConfig = vscode.workspace.getConfiguration(
      EXTENSION_CONFIG_NAME
    );
  }

  static getExtensionConfig<T>(key: string): T | undefined {
    const config = vscode.workspace.getConfiguration(EXTENSION_CONFIG_NAME);
    return config.get<T>(key);
  }

  static getCachedConfig<T>(key: string): T | undefined {
    return this.extensionConfig.get<T>(key);
  }
}
