# 🚀 Salesforce Metadata Opener

A sleek, no-friction way to open Salesforce metadata directly in your browser, right from VS Code.

Currently supports:

- ✅ **Flows** (Screen Flows, Auto-launched, etc.)
- ✅ **Agentforce Agents (Bots)**
- 🆕 **Reports** (Standard and Custom Reports)

More metadata types coming soon (Dashboards, LWC, Apex, etc.)

---

## ✨ Features

- Context-aware file actions
- Command Palette integration
- Auto-deploys your metadata before launching
- Supports both **Flow Builder / Run Mode**, **Agentforce Builder / Setup**, and **Report View / Edit**
- Uses `sf org open` under the hood (respects your default org/session)

---

## 🧠 What It Does

This extension enables rapid navigation from your VS Code workspace to your Salesforce metadata in the browser.

---

### 💡 Flows

- **Right-click a `.flow-meta.xml`** file in the Explorer:

  - `SFDX: Open Flow in Flow Builder`
  - `SFDX: Open Flow in Run Mode`

- **Use the Command Palette** with a `.flow-meta.xml` file active:

  - `SFDX: Open Current Flow in Flow Builder`
  - `SFDX: Open Current Flow in Run Mode`

ℹ️ Run Mode is only available for supported Flow types (e.g., **Screen Flows**). AutoLaunched and system flows are not compatible.

---

### 🤖 Agentforce Bots (Copilot Agents)

- **Right-click a `.bot-meta.xml`** file in the Explorer:

  - `SFDX: Open Agent in Agentforce Builder`
  - `SFDX: Open Agent Details in Setup`

- **Use the Command Palette** with a `.bot-meta.xml` file active:

  - `SFDX: Open Current Agent in Agentforce Builder`
  - `SFDX: Open Current Agent Details in Setup`

ℹ️ Agent Builder uses version-based routing, and this extension fetches the latest BotVersion automatically.

---

### 📊 Reports

- **Right-click a `.report-meta.xml`** file in the Explorer:

  - `SFDX: Open Report in Edit Mode`
  - `SFDX: Open Report in View Mode`

- **Use the Command Palette** with a `.report-meta.xml` file active:

  - `SFDX: Open Current Report in Edit Mode`
  - `SFDX: Open Current Report in View Mode`

ℹ️ Report URLs are opened using direct ID-based paths. This metadata type bypasses the default CLI and always uses org queries to build the correct URL.

---

## ⚙️ Configuration Options

You can customize the extension’s behavior via VS Code settings:

#### `Salesforce Metadata Opener: Deploy Before Open`

> **Default: `true`**

- Automatically deploys your local metadata file before opening it in the browser.
- Disable this if your metadata is already deployed or managed externally.

#### `Salesforce Metadata Opener: Use Sf Command To Open Metadata`

> **Default: `true`**

- When enabled, uses `sf org open --source-file ...` for direct opening.
- When disabled, the extension queries the org for IDs and constructs builder/setup links using metadata APIs.

---

## 🧩 Under the Hood

All commands share robust common logic:

- ✅ Validates file extension (`.flow-meta.xml`, `.bot-meta.xml`, `.report-meta.xml`)
- 🔍 Parses metadata file or resolves DeveloperName
- 🚀 Deploys metadata using `sf project deploy start`
- 🔗 Opens browser via `sf org open` (either with `--source-file` or `--path`)

---

## ✅ Requirements

- **Salesforce CLI (`sf`)** installed
- An authenticated **default org** (`sf org display`)
- A Salesforce project with metadata (e.g., `force-app/main/default/flows/`, `.../bots/`, `.../reports/`)

---

## 🔮 Coming Soon

- Support for:

  - More metadata targets (Apex, Dashboards, LWC)
  - Better debug logging
  - Custom org aliases and context awareness

---

## 📣 Feedback

Have a feature request? Found a bug?

→ Create an [Issue](https://github.com/gitmatheus/sf-metadata-opener/issues)

→ Or email: [contact@matheus.dev](mailto:contact@matheus.dev)

---

Made with ❤️ for Salesforce Developers and Trailblazers.
