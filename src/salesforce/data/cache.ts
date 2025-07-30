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
