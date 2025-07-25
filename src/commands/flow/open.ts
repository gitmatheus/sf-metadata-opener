import { createOpenHandlers } from "../factory";
import { open } from "./helpers";
import { OpenMode } from "../factory";

const handlers = createOpenHandlers(open);

export const openInEditMode = handlers.fromUri(OpenMode.EDIT);
export const openInRunMode = handlers.fromUri(OpenMode.RUN);

export const openFileInEditMode = handlers.fromEditor(OpenMode.EDIT);
export const openFileInRunMode = handlers.fromEditor(OpenMode.RUN);
