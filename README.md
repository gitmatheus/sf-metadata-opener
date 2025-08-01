# 🚀 Salesforce Metadata Opener

A sleek, no-friction way to open Salesforce metadata directly in your browser, right from VS Code.

Currently supports:

- ✅ **Flows**
- ✅ **Agentforce Agents (Bots)**
- ✅ **Reports**
- ✅ **Dashboards**
- ✅ **Validation Rules**
- ✅ **Custom and Standard Objects**

---

## 🧠 What It Does

This extension lets you quickly jump from a metadata file in your project to its corresponding Salesforce UI. Whether you're editing a Flow, an Agentforce Agent, a Validation Rule, or a dashboard, it's all just one click away.

---

## ✨ Features

- Right-click menu and Command Palette integration
- Optional deploy-before-open behavior, configurable per metadata type
- View and Edit modes available for all types
- Auto-detection of latest Flow or Bot version when needed
- In-memory caching for faster performance
- Supports `sf org open file`, when available
- View and clear metadata cache from the Command Palette

---

## ✅ How To Use It

- **Right-click** a supported metadata file to open it in your org

  - `SFDX: Open ... in Edit Mode`
  - `SFDX: Open ... in View Mode`

- **Or** use the Command Palette:

  - `SFDX: Open Current ... in Edit Mode`
  - `SFDX: Open Current ... in View Mode`

The extension will open the page in Edit or View mode, contextually for each type.

---

## 🛠️ Supported Metadata Types

| Metadata Type             | Edit Mode Target   | View Mode Target              |
| ------------------------- | ------------------ | ----------------------------- |
| Flow                      | Flow Builder       | Flow View Page (if supported) |
| Agentforce Agent          | Agentforce Builder | Agent Setup Page              |
| Report                    | Report Builder     | Report Viewer                 |
| Dashboard                 | Dashboard Builder  | Dashboard Viewer              |
| Validation Rule           | Edit in Setup      | Open in Detail Page           |
| Object (Standard/Custom ) | Edit in Setup      | Open in Detail Page           |

---

## ⚙️ Configuration Options

### `Deployable Metadata Types`

Choose which metadata types should be auto-deployed before opening.
Each type is opt-in. You control exactly which ones to deploy.

<img width="644" height="360" alt="List of options to select the deployable metadata types" src="https://github.com/user-attachments/assets/6663b90b-1360-4eae-9b2c-fee8322dcbce" />

### `Use Sf Command To Open Metadata`

> **Default: `true`**

Uses `sf org open --source-file` when supported. If disabled, the extension builds the Lightning URL directly.

### `Enable Caching`

> **Default: `true`**

Caches resolved metadata IDs in memory. This avoids repeating queries for the same metadata.

---

## 💾 Metadata Cache Tools

From the Command Palette:

- `SFDX: Display Cached Record Metadata`
- `SFDX: Clear Cached Record Metadata`

---

## ✅ Requirements

- Salesforce CLI (`sf`)
- Authorized default org (`sf org display`)
- A Salesforce DX project

---

## 🔮 Coming Soon

- Profiles, Permission Sets, Record Pages, Custom Tabs
- Deploy preview diagnostics
- CLI fallback options for complex metadata

---

## 📣 Feedback

→ [Open an issue](https://github.com/gitmatheus/sf-metadata-opener/issues)

→ Email: [contact@matheus.dev](mailto:contact@matheus.dev)

---

Made with ❤️ for Salesforce Developers and Trailblazers.
