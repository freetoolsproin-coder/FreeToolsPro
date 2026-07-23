/**
 * Pass 2: migrate remaining cont-text + related tools to ToolContentLayout
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolsRoot = path.join(__dirname, "..", "src", "tools");

const FOLDER_CATEGORY = {
  calculators: "calculators",
  "business-tools": "business-tools",
  "developer-tools": "developer-tools",
  "image-tools": "image-tools",
  "pdf-tools": "pdf-tools",
  "social-media-tools": "social-media-tools",
  "text-tools": "text-tools",
  trending: "trending-tools",
  "trending-tools": "trending-tools",
  "ai-tools": "ai-tools",
};

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (e.name.endsWith(".jsx")) out.push(f);
  }
  return out;
}

function ensureImport(src) {
  if (src.includes("ToolContentLayout")) return src;
  const line = `import ToolContentLayout from "../../components/ToolContentLayout";\n`;
  if (/from ["'][^"']*components\/Seo["']/.test(src)) {
    return src.replace(/(from ["'][^"']*components\/Seo["'];?\n?)/, `$1${line}`);
  }
  if (/from ["'][^"']*components\/ToolHeroShell["']/.test(src)) {
    return src.replace(/(from ["'][^"']*components\/ToolHeroShell["'];?\n?)/, `$1${line}`);
  }
  return line + src;
}

function guessPath(file, src) {
  const rtp = src.match(/currentToolPath=["']([^"']+)["']/);
  if (rtp) return rtp[1];
  const rel = path.relative(toolsRoot, file).replace(/\\/g, "/");
  const [folder, ...rest] = rel.split("/");
  const base = rest.join("/").replace(/\.jsx$/, "");
  const kebab = base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  const cat = FOLDER_CATEGORY[folder] || folder;
  return `/${cat}/${kebab}`;
}

function migrateFile(file) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("ToolContentLayout")) return false;
  if (!src.includes("cont-text")) return false;
  if (!src.includes("RelatedTools") && !src.includes("ExploreRelatedTools")) return false;

  const folder = path.relative(toolsRoot, file).split(path.sep)[0];
  const category = FOLDER_CATEGORY[folder] || "calculators";
  const toolPath = guessPath(file, src);

  // Flexible: section with cont-text, left md:w-3/4 (class OR className), right related col with RelatedTools
  const re =
    /<section\b([^>]*)\bcont-text\b([^>]*)>([\s\S]*?)<(?:div|Div)\s+(?:className|class)=["'][^"']*md:w-3\/4[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<div\s+(?:className|class)=["'][^"']*(?:md:w-1\/4|relatedtools)[^"']*["'][^>]*>[\s\S]*?(?:<RelatedTools\b[\s\S]*?\/>|<ExploreRelatedTools\b[\s\S]*?\/>)\s*<\/div>\s*<\/div>\s*<\/section>/i;

  if (!re.test(src)) {
    // alternate: sometimes only one wrapping div
    const re2 =
      /<section\b[^>]*\bcont-text\b[^>]*>\s*<div[^>]*>\s*<(?:div)\s+(?:className|class)=["'][^"']*md:w-3\/4[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<div[^>]*(?:relatedtools|md:w-1\/4)[^>]*>[\s\S]*?(?:<RelatedTools\b[\s\S]*?\/>|<ExploreRelatedTools\b[\s\S]*?\/>)\s*<\/div>\s*<\/div>\s*<\/section>/i;
    if (!re2.test(src)) {
      console.log("skip-parse", path.relative(toolsRoot, file));
      return false;
    }
    src = ensureImport(src);
    src = src.replace(re2, (_, left) => {
      return `<ToolContentLayout
        category="${category}"
        currentToolPath="${toolPath}"
      >
${left.trim()}
      </ToolContentLayout>`;
    });
  } else {
    src = ensureImport(src);
    src = src.replace(re, (_m, _a, _b, _mid, left) => {
      return `<ToolContentLayout
        category="${category}"
        currentToolPath="${toolPath}"
      >
${left.trim()}
      </ToolContentLayout>`;
    });
  }

  if (!src.includes("<RelatedTools") && src.includes("import RelatedTools")) {
    src = src.replace(/import RelatedTools from ["'][^"']+["'];?\r?\n?/g, "");
  }
  if (!src.includes("<ExploreRelatedTools") && src.includes("import ExploreRelatedTools")) {
    src = src.replace(/import ExploreRelatedTools from ["'][^"']+["'];?\r?\n?/g, "");
  }

  fs.writeFileSync(file, src);
  console.log("migrated", path.relative(toolsRoot, file));
  return true;
}

let n = 0;
for (const f of walk(toolsRoot)) {
  if (/AgeCalculator|BmiCalculator|CalorieCalculator/.test(f)) continue;
  if (migrateFile(f)) n++;
}
console.log("migrated", n);
