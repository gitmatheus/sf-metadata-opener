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
   * Whether to deploy the local metadata file before opening it in the browser.
   * Helps ensure the latest version is visible in the org.
   */
  static get deployBeforeOpen(): boolean {
    return this.extensionConfig.get<boolean>("deployBeforeOpen", true);
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
