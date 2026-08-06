import fs from "fs";
import path from "path";
import * as acorn from "acorn";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fixNewTools() {
  const f = path.join(ROOT, "src/data/toolWhatItDoes/newTools.js");
  let t = fs.readFileSync(f, "utf8");
  t = t.replace(/(\n  \},\n)(?:\n    \],\n  \},\n)+/g, "$1\n");
  fs.writeFileSync(f, t);
}

function fixTrending() {
  const f = path.join(ROOT, "src/data/toolWhatItDoes/trendingTools.js");
  let t = fs.readFileSync(f, "utf8");
  t = t.replace(
    /\n\n      \{\n        title: "What this is not",[\s\S]*?\n    \],\n  \},\n(\n  "\/trending-tools\/gold-silver-price-tracker")/,
    "\n$1"
  );
  fs.writeFileSync(f, t);
}

fixNewTools();
fixTrending();

for (const rel of [
  "src/data/toolWhatItDoes/newTools.js",
  "src/data/toolWhatItDoes/trendingTools.js",
  "src/data/toolWhatItDoes/calculators.js",
]) {
  const code = fs.readFileSync(path.join(ROOT, rel), "utf8");
  try {
    acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });
    console.log("OK", rel);
  } catch (e) {
    console.log("BAD", rel, e.message);
  }
}
