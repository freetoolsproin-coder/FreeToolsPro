/**
 * Audit routed tool pages for ToolHeroShell / Age pattern coverage
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const routes = fs.readFileSync(path.join(root, "src/routes/appRoutes.jsx"), "utf8");
const lazies = [...routes.matchAll(/lazy\(\(\)\s*=>\s*import\(["']([^"']+)["']\)\)/g)].map((m) => m[1]);

const missing = [];
const ok = [];
for (const imp of lazies) {
  if (!imp.includes("/tools/")) continue;
  if (/DevHome|PdfToWord|PdfToJpg|PdfEditor/.test(imp)) continue;
  const file = path.join(root, "src", imp.replace(/^\.\.\//, "").replace(/^\.\//, "") + (imp.endsWith(".jsx") ? "" : ".jsx"));
  // resolve: ../tools/... from routes means src/tools
  const resolved = path.normalize(path.join(root, "src/routes", imp));
  const candidates = [resolved + ".jsx", resolved, file];
  let found = null;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      found = c;
      break;
    }
  }
  if (!found) {
    missing.push({ imp, reason: "file-missing" });
    continue;
  }
  const src = fs.readFileSync(found, "utf8");
  const covered =
    src.includes("<ToolHeroShell") ||
    src.includes("age-display") ||
    /className=["'][^"']*tool-hero/.test(src);
  if (covered) ok.push(path.relative(root, found));
  else missing.push({ imp: path.relative(root, found), reason: "no-shell" });
}

console.log("Covered:", ok.length);
console.log("Missing:", missing.length);
missing.forEach((m) => console.log(" -", m.imp, m.reason));
