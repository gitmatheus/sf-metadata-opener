/**
 * Sanitizes a name to prevent SOQL/CLI injection by escaping single quotes.
 * If the value is suspiciously malformed, it throws an error.
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== "string") {
    throw new Error("Invalid name: must be a non-empty string.");
  }

  // Basic character check: allow alphanumerics, underscore, dash
  if (!/^[\w-]+$/.test(name)) {
    throw new Error("Name contains unsupported characters.");
  }

  // Escape any single quotes, though they shouldn't appear if above test passes
  return name.replace(/'/g, "\\'");
}
