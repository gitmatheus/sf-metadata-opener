# 🚀 Salesforce Metadata Opener

A sleek, no-friction way to open Salesforce metadata directly in your browser — right from VS Code.

Currently supports:

- ✅ **Flows** (Screen Flows, Auto-launched, etc.)
- ✅ **Agentforce Agents (Bots)**

More metadata types coming soon (Reports, Dashboards, LWC, etc.)

---

## ✨ Features

✅ Context-aware file actions  
✅ Command Palette integration  
✅ Auto-deploys your metadata before launching  
✅ Supports both **Flow Builder / Run Mode** and **Agentforce Builder / Setup**  
✅ Uses `sf org open` under the hood (respects your default org/session)

---

## 🧠 What It Does

This extension enables rapid navigation from your VS Code workspace to your Salesforce metadata in the browser.

<img width="611" height="133" alt="Screenshot 2025-07-21 at 7 37 29 PM" src="https://github.com/user-attachments/assets/f351f593-3208-44c8-bc73-92ebf66afff8" />

---

### 💡 Flows

- **Right-click a `.flow-meta.xml`** file in the Explorer:

  - `SFDX: Open Flow in Flow Builder`
  - `SFDX: Open Flow in Run Mode`

- **Use the Command Palette** with a `.flow-meta.xml` file active:
  - `SFDX: Open Current Flow in Flow Builder`
  - `SFDX: Open Current Flow in Run Mode`

<img width="620" height="627" alt="Screenshot 2025-07-21 at 7 36 58 PM" src="https://github.com/user-attachments/assets/0cc11620-6a7c-441f-983e-644b9207b097" /> 

ℹ️ Run Mode is only available for supported Flow types (e.g., **Screen Flows**). AutoLaunched and system flows are not compatible.


---

### 🤖 Agentforce Bots (Copilot Agents)

- **Right-click a `.bot-meta.xml`** file in the Explorer:

  - `SFDX: Open Agent in Agentforce Builder`
  - `SFDX: Open Agent Details in Setup`

- **Use the Command Palette** with a `.bot-meta.xml` file active:
  - `SFDX: Open Current Agent in Agentforce Builder`
  - `SFDX: Open Current Agent Details in Setup`
 

<img width="705" height="620" alt="Screenshot 2025-07-21 at 7 36 44 PM" src="https://github.com/user-attachments/assets/53642776-368d-464f-b3ff-5ac7dc7b0811" />

ℹ️ Agent Builder uses version-based routing, and this extension fetches the latest BotVersion automatically.



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

<img width="763" height="356" alt="Screenshot 2025-07-21 at 7 45 09 PM" src="https://github.com/user-attachments/assets/6b65a975-3fa6-48c0-9f04-177b0de3a632" />

---

## 🧩 Under the Hood

All commands share robust common logic:

- ✅ Validates file extension (`.flow-meta.xml`, `.bot-meta.xml`)
- 🔍 Parses metadata file (for flows) or resolves DeveloperName
- 🚀 Deploys metadata using `sf project deploy start`
- 🔗 Opens browser via `sf org open` (either with `--source-file` or `--path`)

---

## ✅ Requirements

- **Salesforce CLI (`sf`)** installed
- An authenticated **default org** (`sf org display`)
- A Salesforce project with metadata (e.g., `force-app/main/default/flows/`, `.../bots/`)

---

## 🔮 Coming Soon

- Support for:
  - More metadata targets (Reports, Apex, LWC)
  - Better debug logging
  - Custom org aliases and context awareness

---

## 📣 Feedback

Have a feature request? Found a bug?

→ Create an [Issue](https://github.com/gitmatheus/sf-metadata-opener/issues)  
→ Or email: contact@matheus.dev

---

Made with ❤️ for Salesforce Developers and Trailblazers.
