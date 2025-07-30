import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";
import { getOrgId } from "./org";

const CACHE_FILENAME = "record-cache.json";

/**
 * Reads a cached metadata object from workspace memory or local file (if available).
 */
export async function readCachedMetadata<T>(
  metadataName: string,
  context: vscode.ExtensionContext
): Promise<T | undefined> {
  const orgId = await getOrgId();
  const key = `${orgId}:${metadataName}`;
  const memCache = context.workspaceState.get<T>(key);
  if (memCache) return memCache;

  try {
    const filePath = path.join(context.globalStorageUri.fsPath, CACHE_FILENAME);
    const raw = await fs.readFile(filePath, "utf-8");
    const cache = JSON.parse(raw);
    const record = cache?.[orgId]?.[metadataName] as T | undefined;

    if (record) {
      context.workspaceState.update(key, record);
    }

    return record;
  } catch {
    return undefined;
  }
}

/**
 * Writes a metadata object to both memory and persistent org-scoped cache.
 */
export async function writeCachedMetadata<T>(
  metadataName: string,
  metadata: T,
  context: vscode.ExtensionContext
): Promise<void> {
  const orgId = await getOrgId();
  const key = `${orgId}:${metadataName}`;
  await context.workspaceState.update(key, metadata);

  const filePath = path.join(context.globalStorageUri.fsPath, CACHE_FILENAME);
  let cache: Record<string, Record<string, T>> = {};

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    cache = JSON.parse(raw);
  } catch {
    // File doesn't exist or is invalid JSON – start fresh
  }

  if (!cache[orgId]) {
    cache[orgId] = {};
  }

  cache[orgId][metadataName] = metadata;

  await fs.mkdir(context.globalStorageUri.fsPath, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(cache, null, 2), "utf-8");
}

/**
 * Clears all cached metadata entries from memory and disk.
 */
export async function clearMetadataCache(
  context: vscode.ExtensionContext
): Promise<void> {
  // Clear ALL workspaceState keys
  const allKeys = context.workspaceState.keys();
  await Promise.all(
    allKeys.map((key) => context.workspaceState.update(key, undefined))
  );

  // Delete the persistent cache file
  const filePath = path.join(context.globalStorageUri.fsPath, CACHE_FILENAME);
  try {
    await fs.unlink(filePath);
  } catch {
    // File doesn't exist — nothing to delete
  }
}
