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

  static get useSfCommandToOpenMetadata(): boolean {
    return this.extensionConfig.get<boolean>("useSfCommandToOpenMetadata", true);
  }

  static get deployBeforeOpen(): boolean {
    return this.extensionConfig.get<boolean>("deployBeforeOpen", true);
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
