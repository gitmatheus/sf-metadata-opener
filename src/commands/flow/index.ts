import { open } from "./helpers";
import { registerOpenHandlers } from "../open";

// Export the handlers
const handlers = registerOpenHandlers(open);
export const openInEditMode = handlers.inEditMode;
export const openInRunMode = handlers.inRunMode;
export const openFileInEditMode = handlers.currentInEditMode;
export const openFileInRunMode = handlers.currentInRunMode;
