import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sourcePath = join(root, "styles", "globals.css");
const targetPath = join(root, "app", "globals.css");

const source = readFileSync(sourcePath, "utf8");
const banner = "/* AUTO-GERADO: nao editar direto. Fonte: styles/globals.css */\n";

writeFileSync(targetPath, `${banner}${source}`);
console.log("globals.css sincronizado em app/globals.css");
