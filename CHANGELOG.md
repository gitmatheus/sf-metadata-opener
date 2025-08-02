# 📦 Changelog

All notable changes to this project will be documented here.

---

## [1.0.1] - 2025-08-01

### ✨ Added

- ⚡ **FlexiPage support** (Lightning App Builder):

  - Right-click `.flexipage-meta.xml` to open in:

    - **Edit Mode** (App Builder)
    - **View Mode** (FlexiPage Setup)

  - Full support for Command Palette and file context menu

- ⚙️ **Custom edit URL builder for FlexiPages**:

  - Mirrors the behavior of SObjects: uses `retUrl` to redirect users back to the FlexiPage list after edit

- 🧩 **New `openFileSupportedMetadataTypes` setting**:

  - Works in conjunction with `useOpenFileCommandToOpenMetadata`
  - Allows selecting _which_ types (e.g., `Flow`, `FlexiPage`) use `sf org open --source-file`
  - Fully configurable per type (default: `["Flow", "FlexiPage"]`)

### 🔄 Changed

- 🧠 `mustUseOpenFileCommand()` now validates against:

  - CLI mode (`edit` only)
  - Global toggle (`useOpenFileCommandToOpenMetadata`)
  - User-selected types (`openFileSupportedMetadataTypes`)
  - Internal file support flag

- 🧼 Improved descriptions for related settings in `package.json`:

  - Clearer relationship between global toggle and type list
  - Marked both as _EDIT-mode only_

- ✅ `DeployableMetadataKeys` and settings updated to include `"FlexiPage"`

### 🧼 Internal

- 🧩 Added `src/openers/flexipage/` module with:

  - `registerHandlers()`
  - `retrieveRecord()` using Tooling API
  - `resolvePath()` with retUrl support
  - Full typing in `model.ts`

- 🔗 Updated `extension.ts` and manifest files to auto-register FlexiPage commands

- 📋 Menu conditions and activation events added for `.flexipage-meta.xml`

---

## [1.0.0] - 2025-07-31

### ✨ Added

- 🧱 **New metadata support**:

  - ✅ **Validation Rules**
  - ✅ **SObjects** (Standard & Custom)

- 🧠 **Per-type deploy setting**:

  - New setting: `Salesforce Metadata Opener: Deployable Metadata Types`
  - Allows selecting which metadata types should be deployed automatically before opening
  - Fully replaces the old `deployBeforeOpen` global toggle

- ⚙️ **Custom SObject suffix parsing**:

  - Robust recognition for 20+ suffixes (`__c`, `__e`, `__mdt`, etc.)
  - Utilities like `normalizeSObjectName()` and `getSObjectTypeLabel()` included

### 🔄 Changed

- 🏗️ **Project structure refactor**:

  - All metadata openers moved to `src/openers/{type}/`
  - Each opener defines:

    - `registerHandlers()`
    - `resolvePath()`
    - `retrieveRecord()` (Tooling or REST)

- 🧠 **Generic open logic**:

  - Introduced shared `openMetadata()` handler for all types
  - URL resolution now modular via `resolveMetadataPath()`, mapped by type

- 🧩 **Factory pattern improvements**:

  - `createOpenCommand()` generates CLI open strings or fallback URLs
  - `buildOpenPathCommand()` available for direct Lightning URL use

- 🧠 **Smarter deploy logic**:

  - Deploy now respects configured types via `deployableMetadataTypes`

### 🧼 Internal

- 🧠 **Record metadata caching**:

  - Now supports parent-aware keys (e.g., `Account:MyValidationRule`)
  - Centralized in `salesforce/data/cache.ts`

- 📦 **Metadata settings mapped properly**:

  - `DeployableMetadataKeys` maps setting strings to `FileType`
  - Label consistency via `MetadataLabels` and `enumDescriptions`

- 🔗 **Simplified activation & menu config**:

  - Command, context menu, and palette entries sorted alphabetically
  - Auto-completion now fully reflects supported types

## [0.0.5] - 2025-07-29

### ✨ Added

- 📊 **Dashboard metadata support**:

  - Right-click `.dashboard-meta.xml` to open in:
    - **Edit Mode** (Lightning Dashboard Builder)
    - **View Mode** (Standard Lightning Dashboard page)
  - Command Palette equivalents also available.

- 💾 **Metadata Caching**:

  - Improves performance by storing record metadata in memory using `ExtensionContext.workspaceState`.
  - Reduces repeated org queries for frequently opened metadata.
  - Caching is enabled via a new setting: `Salesforce Metadata Opener: Enable Caching`.

- 🧹 **Clear Metadata Cache** command:

  - `SFDX: Clear Cached Record Metadata` (Command Palette)

- 👀 **Display Metadata Cache** command:
  - `SFDX: Display Cached Record Metadata` (Command Palette)
  - Shows a JSON-formatted view of metadata grouped by org ID.

### ⚙️ Changed

- Flows and Bots now bypass cache by default to always fetch the latest deployed versions.
- Cache persistence was migrated from file system to in-memory for speed.
- Cache logic modularized under `salesforce/data/cache.ts`.

### 🧼 Internal

- 🧠 `retrieveMetadata()` updated to support `skipCacheCheck` flag per metadata type.
- ♻️ `writeCachedMetadata()` and `readCachedMetadata()` now use scoped keys like `orgId:DeveloperName`.
- 🧪 OutputChannel displays cached state directly in VS Code with a dedicated command.

---

## [0.0.4] - 2025-07-28

### ✨ Added

- 📊 **Report metadata support**:

  - Right-click `.report-meta.xml` to open in:

    - **Edit Mode** (Lightning Report Builder)
    - **View Mode** (Standard Lightning Report Page)

  - Command Palette equivalents also available.

- 📁 New `src/commands/report/` folder added for Report-specific logic.
- 🧠 `retrieveRecord()` for reports queries the `Report` object using standard REST API, not Tooling.
- 🔗 `resolvePath()` for Reports constructs direct ID-based Lightning URLs.
- ⚙️ `skipDefaultCli` flag added to `createOpenCommand()` to force ID-based opening (used by Reports).

### ⚙️ Changed

- 🌐 `resolveMetadataPath()` no longer contains logic for each metadata type.

  - That logic is now delegated to `resolvePath()` functions in each helper (`flow`, `bot`, `report`).

- ✂️ Removed centralized `resolveBotPath`, `resolveFlowPath`, `resolveReportPath` from `utils/path.ts`.
- 📦 `createOpenCommand()` refactored to use an `options` object, with optional `skipDefaultCli` parameter.

### 🧼 Internal

- 🤖 Helpers for Bot, Flow, and Report now consistently implement `resolvePath(ctx)` per type.
- 🧩 Metadata-specific URL generation is modular and testable.
- 🗂️ Manifest commands, menus, and activation events are now sourced from separate JSON files and merged into `package.json` at build time.
- 🧼 `build-manifest.js` and `prepare.js` scripts added for maintainable packaging.

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
- Improved flow handling for View Mode with better type validation.
- `Properties` class added to centralize extension setting access.
- Commands now reload configuration in real time via `onDidChangeConfiguration`.

### 🧼 Internal

- Extracted `deployMetadata()` to helper function.
- Cleaned up `flow.ts` to delegate open behavior based on settings.
- Updated `package.json` to define settings in `contributes.configuration`.

---

## [0.0.1] - 2025-07-18

### 🚀 Initial Release

- Open `.flow-meta.xml` in Flow Builder or View Mode.
- Supports right-click menu and command palette.
- Automatically deploys metadata before launch.
- Queries latest Flow ID and handles screen flow type detection.
