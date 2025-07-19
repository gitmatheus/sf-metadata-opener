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

This extension enables rapid navigation from your VS Code workspace to Flow metadata in the browser. It ensures you are always looking at the latest deployed version.

- **Right-click a `.flow-meta.xml`** file in the Explorer:

  - `SFDX: Open Flow in Flow Builder`
  - `SFDX: Open Flow in Run Mode`

<img width="726" height="637" alt="Screenshot 2025-07-18 at 6 53 15 PM" src="https://github.com/user-attachments/assets/d2ad9bdc-2eec-4f7d-97a7-f06287200474" />

---

- **Use the Command Palette** with a `.flow-meta.xml` file active:
  - `SFDX: Open Current Flow in Flow Builder`
  - `SFDX: Open Current Flow in Run Mode`

<img width="754" height="177" alt="Screenshot 2025-07-18 at 6 55 32 PM" src="https://github.com/user-attachments/assets/73f0d216-3fb3-458c-8391-ca2f992e9e98" />

ℹ The commands to open the flow in Run Moe will only support certain Flow types, like Screen Flows.

---

### 🧩 Under the Hood

All commands share robust common logic:

- ✅ Validates `.flow-meta.xml` extension
- 🔍 Parses XML for `<processType>` to verify flow type
- 🚀 Deploys your local file using `sf project deploy start`
- 🌐 Opens the flow using `sf org open --path ...`

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

Use with caution. This disables file filtering.

## 📣 Feedback

Have a feature request? Found a bug?

→ Create an [Issue](https://github.com/gitmatheus/sf-metadata-opener/issues)
→ Or email: contact@matheus.dev

---

Made with ❤️ for Salesforce Developers and Trailblazers.
