const fs = require("fs");
const path = require("path");

const basePackage = JSON.parse(fs.readFileSync("package.base.json", "utf8"));
const commands = require("./commands.json");
const menus = require("./menus.json");
const activationEvents = require("./activationEvents.json");
const contributes = require("./contributes.json");

basePackage.contributes = contributes;
basePackage.contributes.commands = commands;
basePackage.contributes.menus = menus;
basePackage.activationEvents = activationEvents;

const outputPath = path.resolve(__dirname, "../../package.json");

fs.writeFileSync(outputPath, JSON.stringify(basePackage, null, 2));
console.log("✅ package.json was created or overwritten successfully.");
