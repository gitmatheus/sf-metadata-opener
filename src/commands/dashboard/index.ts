import { open } from "./helpers";
import { registerOpenHandlers } from "../handlers";

export * from "./helpers";

// Export the handlers
const handlers = registerOpenHandlers(open);
export const openInEditMode = handlers.inEditMode;
export const openInViewMode = handlers.inViewMode;
export const openFileInEditMode = handlers.currentInEditMode;
export const openFileInViewMode = handlers.currentInViewMode;