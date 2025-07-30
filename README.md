# 🚀 Salesforce Metadata Opener

A sleek, no-friction way to open Salesforce metadata directly in your browser, right from VS Code.

Currently supports:

- ✅ **Flows** (Screen Flows, Auto-launched, etc.)
- ✅ **Agentforce Agents (Bots)**
- ✅ **Reports** (Standard and Custom Reports)
- 🆕 **Dashboards** (Classic and Lightning)

More metadata types coming soon (Validation Rules, Profiles, Permission Sets, etc.)

---

## 🧠 What It Does

This extension enables rapid navigation from your VS Code workspace to your Salesforce metadata in the browser. It supports all the usual suspects like Flows, Reports, Dashboards, and Agentforce Bots, and more are coming.

---

## ✨ Features

- Context-aware file actions
- Command Palette integration
- Auto-deploys your metadata before launching
- Supports:
  - **Flow Builder / Run Mode**
  - **Agentforce Builder / Setup**
  - **Report View / Edit**
  - **Dashboard View / Edit**
- Uses `sf org open` under the hood (respects your default org/session)
- 💾 Optional in-memory caching to reduce redundant org queries
- 👀 Commands to view or clear metadata cache

---

### 💡 Flows

- **Right-click a `.flow-meta.xml`** file in the Explorer:

  - `SFDX: Open Flow in Flow Builder`
  - `SFDX: Open Flow in Run Mode`

- **Use the Command Palette** with a `.flow-meta.xml` file active:
  - `SFDX: Open Current Flow in Flow Builder`
  - `SFDX: Open Current Flow in Run Mode`

ℹ️ Run Mode is only available for supported Flow types (e.g., **Screen Flows**).

---

### 🤖 Agentforce Bots (Copilot Agents)

- **Right-click a `.bot-meta.xml`** file in the Explorer:

  - `SFDX: Open Agent in Agentforce Builder`
  - `SFDX: Open Agent Details in Setup`

- **Use the Command Palette** with a `.bot-meta.xml` file active:
  - `SFDX: Open Current Agent in Agentforce Builder`
  - `SFDX: Open Current Agent Details in Setup`

ℹ️ Automatically fetches the latest BotVersion for accurate routing.

---

### 📊 Reports

- **Right-click a `.report-meta.xml`** file in the Explorer:

  - `SFDX: Open Report in Edit Mode`
  - `SFDX: Open Report in View Mode`

- **Use the Command Palette** with a `.report-meta.xml` file active:
  - `SFDX: Open Current Report in Edit Mode`
  - `SFDX: Open Current Report in View Mode`

ℹ️ Report URLs are opened using direct ID-based paths.

---

### 📈 Dashboards

- **Right-click a `.dashboard-meta.xml`** file in the Explorer:

  - `SFDX: Open Dashboard in Edit Mode`
  - `SFDX: Open Dashboard in View Mode`

- **Use the Command Palette** with a `.dashboard-meta.xml` file active:
  - `SFDX: Open Current Dashboard in Edit Mode`
  - `SFDX: Open Current Dashboard in View Mode`

ℹ️ Dashboard URLs are opened using direct ID-based paths.

---

## ⚙️ Configuration Options

You can customize the extension’s behavior via VS Code settings:

### `Deploy Before Open`

> **Default: `true`**

Automatically deploys your metadata file before opening.
Disable this if your metadata is already deployed or managed externally.

### `Use Sf Command To Open Metadata`

> **Default: `true`**

Uses `sf org open --source-file` when possible. When disabled, falls back to org queries + Lightning URLs.

### `Enable Caching`

> **Default: `false`**

Caches metadata results in memory per org, for performance and less requests to the org.

#### Metadata Cache Behavior

| Metadata Type | Caching Enabled | Notes                            |
| ------------- | --------------- | -------------------------------- |
| Flow          | ❌ No           | Always fetches latest version ID |
| Bot           | ❌ No           | Always fetches latest BotVersion |
| Report        | ✅ Yes          | Reads from cache if enabled      |
| Dashboard     | ✅ Yes          | Reads from cache if enabled      |

---

## 🧪 Metadata Cache Tools

- `SFDX: Display Cached Record Metadata` – view a JSON map of all cached records
- `SFDX: Clear Cached Record Metadata` – remove all cached metadata

---

## ✅ Requirements

- Salesforce CLI (`sf`)
- Authenticated default org (`sf org display`)
- A local Salesforce project

---

## 🔮 Coming Soon

- Validation Rules, Profiles, Permission Sets, Record Pages, Custom Tabs
- Debug logs and diagnostics
- Better deploy-preview support

---

## 📣 Feedback

→ [Open an issue](https://github.com/gitmatheus/sf-metadata-opener/issues)  
→ Email: [contact@matheus.dev](mailto:contact@matheus.dev)

---

Made with ❤️ for Salesforce Developers and Trailblazers.
