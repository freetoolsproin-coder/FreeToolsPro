/**
 * Remove option profit calculator (equity derivatives).
 * node scripts/remove-option-profit.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ID = "option-profit-calculator";
const ROUTE = "/calculators/option-profit-calculator";
const COMP = "OptionProfitCalculator";

function patch(file, fn) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  const before = fs.readFileSync(p, "utf8");
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(p, after, "utf8");
    console.log("patched", file);
  }
}

patch("src/data/toolDefinitions.js", (t) =>
  t.replace(new RegExp(`\\n\\{\\s*\\n\\s*id: "${ID}",[\\s\\S]*?\\n\\},`, "g"), "\n")
);
patch("src/routes/appRoutes.jsx", (t) => {
  t = t.replace(new RegExp(`\\nconst ${COMP} = lazy\\(\\(\\) => import\\("[^"]+"\\)\\);\\r?\\n`, "g"), "\n");
  t = t.replace(
    /\n\s*\{\s*\n\s*path: "([^"]+)",\s*\n\s*element: \(\s*\n\s*<Suspense fallback=\{fallback\}>\s*\n\s*<([A-Za-z0-9]+) \/>\s*\n\s*<\/Suspense>\s*\n\s*\),\s*\n\s*\},/g,
    (full, routePath, comp) => (routePath === ROUTE || comp === COMP ? "\n" : full)
  );
  return t;
});
patch("src/seo/seoConfig.js", (t) =>
  t.replace(/\n\s*[A-Za-z0-9_]+:\s*\{[^{}]*?path:\s*"\/calculators\/option-profit-calculator"[^{}]*?\},/g, "\n")
);
patch("src/components/config/seoRoutes.js", (t) =>
  t.replace(/\n\s*"\/calculators\/option-profit-calculator":\s*\{[^{}]*?\},/g, "\n")
);
patch("public/sitemap.xml", (t) =>
  t.replace(/\s*<url>\s*<loc>https:\/\/freetoolspro\.in\/calculators\/option-profit-calculator<\/loc>[\s\S]*?<\/url>/g, "")
);
patch("vite.config.js", (t) => t.replace(/\n\s*"\/calculators\/option-profit-calculator"\s*,/g, "\n"));
patch("src/data/toolWhatItDoes/calculators.js", (t) =>
  t.replace(/\n\s*"\/calculators\/option-profit-calculator":\s*\{[\s\S]*?\n\s*\},/g, "\n")
);
patch("src/data/homeSections.js", (t) => t.replace(/\n\s*"option-profit-calculator",/g, "\n"));

const file = path.join(ROOT, "src/tools/calculators/OptionProfitCalculator.jsx");
if (fs.existsSync(file)) fs.unlinkSync(file);
console.log("DONE option-profit");
