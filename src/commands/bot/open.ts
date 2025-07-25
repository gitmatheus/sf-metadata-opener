import { createOpenHandlers } from "../factory";
import { open } from "./helpers";
import { OpenMode } from "../builder";

const handlers = createOpenHandlers(open);

export const openInEditMode = handlers.fromUri(OpenMode.EDIT);
export const openInViewMode = handlers.fromUri(OpenMode.VIEW);

export const openFileInEditMode = handlers.fromEditor(OpenMode.EDIT);
export const openFileInViewMode = handlers.fromEditor(OpenMode.VIEW);