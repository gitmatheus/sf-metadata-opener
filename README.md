# 🚀 Salesforce Metadata Opener

A sleek, no-friction way to open Salesforce metadata directly in your browser — right from VS Code.

Currently supports **Flows**, with more metadata types on the roadmap (Other Metadata, Reports, Dashboards, etc.).

## ✨ Features

✅ Context-aware file actions  
✅ Command Palette integration  
✅ Auto-deploys your Flow metadata before launching  
✅ Supports both **Flow Builder** and **Run Mode**  
✅ Uses `sf org open` under the hood (respects your default org/session)

---

## 🧠 What It Does

- **Right-click a `.flow-meta.xml`** file in the Explorer:

  - `SFDX: Open Flow in Flow Builder`
  - `SFDX: Open Flow in Run Mode` _(only for supported Flow types like Screen Flows)_

- **Use the Command Palette** with a `.flow-meta.xml` file active:
  - `SFDX: Open Current Flow in Flow Builder`
  - `SFDX: Open Current Flow in Run Mode`

Both entry points share robust logic:

- Validates file extension
- Reads the flow type from XML (`<processType>`)
- Deploys your flow to Salesforce
- Opens the Flow using `sf org open --path ...`

---

## ✅ Requirements

- **Salesforce CLI (`sf`)** installed
- An authenticated **default org** (`sf org display`)
- A Salesforce project with metadata (`force-app/main/default/flows/...`)

---

## 🔮 Coming Soon

- Support for:
  - Configurable metadata targets
  - Better telemetry & debug logging
  - More Metadata Types

---

## 💡 Pro Tip

Want to experiment?
Temporarily enable all context menu actions with this in `package.json`:

```json
"when": "true"
```
