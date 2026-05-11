import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.cwd();
const sourceRoots = [join(root, "app"), join(root, "components")];
const cssPath = join(root, "styles", "globals.css");
const layoutPath = join(root, "app", "layout.tsx");
const appCssPath = join(root, "app", "globals.css");

function walk(dir, fileList = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, fileList);
      continue;
    }
    const ext = extname(fullPath);
    if (ext === ".tsx" || ext === ".ts") fileList.push(fullPath);
  }
  return fileList;
}

function getClassNamesFromSource(content) {
  const classes = new Set();
  const regex = /className\s*=\s*["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content))) {
    const names = match[1].split(/\s+/).filter(Boolean);
    for (const name of names) classes.add(name.trim());
  }
  return classes;
}

function getCssClassNames(content) {
  const classes = new Set();
  const regex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)/g;
  let match;
  while ((match = regex.exec(content))) {
    classes.add(match[1]);
  }
  return classes;
}

const css = readFileSync(cssPath, "utf8");
const appCss = readFileSync(appCssPath, "utf8");
const layoutSource = readFileSync(layoutPath, "utf8");

if (!layoutSource.includes('import "./globals.css";')) {
  console.error("Contrato visual quebrado: app/layout.tsx precisa importar ./globals.css");
  process.exit(1);
}

const normalizedAppCss = appCss.replace(/^\/\* AUTO-GERADO:[^\n]*\n/, "");
if (normalizedAppCss !== css) {
  console.error("Contrato visual quebrado: app/globals.css fora de sincronia com styles/globals.css");
  console.error("Execute: npm run sync:styles");
  process.exit(1);
}

const cssClasses = getCssClassNames(css);

const requiredCoreSelectors = ["app-shell", "sidebar", "main", "card", "grid", "muted", "row-item"];
const missingCoreSelectors = requiredCoreSelectors.filter((selector) => !cssClasses.has(selector));

if (missingCoreSelectors.length > 0) {
  console.error("Contrato visual quebrado: seletores-base ausentes em styles/globals.css");
  for (const selector of missingCoreSelectors) console.error(`- .${selector}`);
  process.exit(1);
}

const sourceFiles = sourceRoots.flatMap((dir) => walk(dir));
const usedClasses = new Set();

for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  const classes = getClassNamesFromSource(content);
  for (const name of classes) usedClasses.add(name);
}

const ignored = new Set(["active"]);
const missing = [...usedClasses].filter((name) => !ignored.has(name) && !cssClasses.has(name));

if (missing.length > 0) {
  console.error("Contrato visual quebrado: classes usadas sem definicao no CSS global");
  for (const className of missing.sort()) console.error(`- ${className}`);
  process.exit(1);
}

console.log("Contrato visual OK: classes e CSS global consistentes.");
