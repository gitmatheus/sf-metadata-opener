import * as vscode from "vscode";
import { getOrgId } from "./org";

/**
 * Reads a cached metadata object from workspace memory (per org).
 */
export async function readCachedMetadata<T>(
  metadataName: string,
  context: vscode.ExtensionContext
): Promise<T | undefined> {
  const orgId = await getOrgId();
  const key = `${orgId}:${metadataName}`;
  return context.workspaceState.get<T>(key);
}

/**
 * Writes a metadata object to workspace memory (per org).
 */
export async function writeCachedMetadata<T>(
  metadataName: string,
  metadata: T,
  context: vscode.ExtensionContext
): Promise<void> {
  const orgId = await getOrgId();
  const key = `${orgId}:${metadataName}`;
  await context.workspaceState.update(key, metadata);
}

/**
 * Clears all cached metadata entries from workspace memory.
 */
export async function clearMetadataCache(
  context: vscode.ExtensionContext
): Promise<void> {
  const allKeys = context.workspaceState.keys();
  await Promise.all(
    allKeys.map((key) => context.workspaceState.update(key, undefined))
  );
}

/**
 * Opens the VS Code Output panel with a JSON dump of all cached metadata.
 */
export async function displayMetadataCache(
  context: vscode.ExtensionContext
): Promise<void> {
  try {
    const cache = await getFullMetadataCache(context);
    const formatted = JSON.stringify(cache, null, 2);

    const output = vscode.window.createOutputChannel(
      "Salesforce Metadata Cache"
    );
    output.clear();
    output.appendLine(formatted);
    output.show(true);
  } catch (err: any) {
    vscode.window.showErrorMessage(`Error displaying cache: ${err.message}`);
  }
}

/**
 * Displays all cached metadata in a structured object grouped by org.
 */
export async function getFullMetadataCache(
  context: vscode.ExtensionContext
): Promise<Record<string, Record<string, unknown>>> {
  const allKeys = context.workspaceState.keys();
  const grouped: Record<string, Record<string, unknown>> = {};

  for (const key of allKeys) {
    const [orgId, metadataName] = key.split(":");
    if (!orgId || !metadataName) continue;

    const value = await context.workspaceState.get(key);
    if (value) {
      grouped[orgId] ??= {};
      grouped[orgId][metadataName] = value;
    }
  }

  return grouped;
}
