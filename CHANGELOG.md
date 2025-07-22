# 📦 Changelog

All notable changes to this project will be documented here.

---

## [0.0.3] - 2025-07-21

### ✨ Added

- 🧠 **Agentforce Agent (Bot) support**:
  - Right-click `.bot-meta.xml` to open in:
    - Agentforce Builder
    - Setup (Details page)
  - Command Palette equivalents also available.
- 📁 New folder structure under `src/commands/bot` for Bot logic.
- 🔍 `getLatestBotInfo()` uses nested SOQL to fetch the latest BotVersion in one query.
- ⚙️ New `fileExtensions.ts` enum for shared metadata suffixes (`.flow-meta.xml`, `.bot-meta.xml`).
- 🧱 `parseBotNameFromFilePath()` and `parseMetadataNameFromFilePath()` helpers in `utils/`.

### ⚙️ Changed

- All open logic now routes through shared `open()` functions in both `flow/helpers.ts` and `bot/helpers.ts`.
- Shared `Mode` enums for open type (`EDIT`, `RUN`, `BUILDER`, `SETUP`) to streamline flow and bot behavior.
- `sf org open` logic now respects new extension settings for both Bots and Flows.
- Centralized path detection from editor via `resolveFilePathFromEditor()` in `utils/path.ts`.

### 🧼 Internal

- Moved Salesforce metadata queries into a new `salesforce/data/` folder.
- Defined typed interfaces for `Bot` and `BotVersion` with subquery support in `salesforce/model/bot.ts`.
- Consolidated open command logic into `buildOpenCommand()` inside each metadata type helper.
- Extracted settings management to the `Properties` utility and connected it to `onDidChangeConfiguration`.

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
