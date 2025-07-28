import { createOpenHandlers, OpenMode } from "./factory";

/**
 * Creates standard open handlers for common metadata types.
 *
 * Used to avoid duplicate `open.ts` files for each metadata module.
 */
export function registerOpenHandlers(openFn: (filePath: string, mode: OpenMode) => Promise<void>) {
  const handlers = createOpenHandlers(openFn);

  return {
    inEditMode: handlers.fromUri(OpenMode.EDIT),
    inViewMode: handlers.fromUri(OpenMode.VIEW),
    inRunMode: handlers.fromUri(OpenMode.RUN),

    currentInEditMode: handlers.fromEditor(OpenMode.EDIT),
    currentInViewMode: handlers.fromEditor(OpenMode.VIEW),
    currentInRunMode: handlers.fromEditor(OpenMode.RUN),
  };
}
