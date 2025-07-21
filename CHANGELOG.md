# 📦 Changelog

All notable changes to this project will be documented here.

---

## [0.0.2] - 2025-07-19

### ✨ Added

- Configuration settings:
  - `Deploy Before Open`: Toggle automatic deployment before opening flows.
  - `Use Sf Command To Open Flow`: Open using `--source-file` instead of querying the org.

### ⚙️ Changed

- Logic split to conditionally skip deploy or metadata queries based on settings.
- Improved flow handling for Run Mode with better type validation.
- `Properties` class added to centralize extension setting access.
- Commands now reload configuration in real time via `onDidChangeConfiguration`.

### 🧼 Internal

- Extracted `deployMetadata()` to helper function.
- Cleaned up `flow.ts` to delegate open behavior based on settings.
- Updated `package.json` to define settings in `contributes.configuration`.

---

## [0.0.1] - 2025-07-18

### 🚀 Initial Release

- Open `.flow-meta.xml` in Flow Builder or Run Mode.
- Supports right-click menu and command palette.
- Automatically deploys metadata before launch.
- Queries latest Flow ID and handles screen flow type detection.
