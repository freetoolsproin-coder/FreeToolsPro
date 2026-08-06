import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { DEV_CATALOG_NORMALIZED } = await import(
  pathToFileURL(path.join(ROOT, "src/data/devCatalogManifest.js")).href
);

const routesPath = path.join(ROOT, "src/routes/appRoutes.jsx");
let text = fs.readFileSync(routesPath, "utf8");

const missing = DEV_CATALOG_NORMALIZED.filter(
  (tool) => !text.includes(`const ${tool.component} = lazy`)
);

console.log("adding", missing.length, "lazy imports");

if (missing.length) {
  const block =
    missing
      .map(
        (tool) =>
          `const ${tool.component} = lazy(() => import("../tools/${tool.folder}/${tool.component}"));`
      )
      .join("\n") + "\n";

  const re =
    /const LlmReadinessChecker = lazy\(\(\) => import\("\.\.\/tools\/developer-tools\/LlmReadinessChecker"\)\);\r?\n/;
  if (!re.test(text)) {
    throw new Error("anchor missing");
  }
  text = text.replace(re, (m) => m + block);
  fs.writeFileSync(routesPath, text, "utf8");
}

const used = [...text.matchAll(/<([A-Z][A-Za-z0-9]*)\s*\/>/g)].map((m) => m[1]);
const declared = [...text.matchAll(/const ([A-Z][A-Za-z0-9]*) = lazy/g)].map((m) => m[1]);
const still = [...new Set(used)].filter((u) => !declared.includes(u));
console.log("still missing:", still);
