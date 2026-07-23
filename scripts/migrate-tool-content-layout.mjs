/**
 * Migrate tool page heroes to 40/60 and cont-text sections to ToolContentLayout.
 * Run: node scripts/migrate-tool-content-layout.mjs
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

function ensureImport(src, name, from) {
  if (src.includes(`import ${name} from`) || src.includes(`import ${name},`)) return src;
  if (/from ["'][^"']*components\/Seo["']/.test(src)) {
    return src.replace(
      /(from ["'][^"']*components\/Seo["'];?)/,
      `$1\nimport ${name} from "${from}";`
    );
  }
  if (/from ["'][^"']*components\/ToolHeroShell["']/.test(src)) {
    return src.replace(
      /(from ["'][^"']*components\/ToolHeroShell["'];?)/,
      `$1\nimport ${name} from "${from}";`
    );
  }
  return `import ${name} from "${from}";\n` + src;
}

function guessPath(file, src) {
  const m = src.match(/Seo page=["']([^"']+)["']/);
  // Prefer RelatedTools currentToolPath if present
  const rtp = src.match(/currentToolPath=["']([^"']+)["']/);
  if (rtp) return rtp[1];
  // Derive from folder+filename kebab
  const rel = path.relative(toolsRoot, file).replace(/\\/g, "/");
  const parts = rel.split("/");
  const folder = parts[0];
  const base = parts[parts.length - 1].replace(/\.jsx$/, "");
  const kebab = base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  const cat = FOLDER_CATEGORY[folder] || folder;
  return `/${cat}/${kebab}`;
}

function migrateHero(src) {
  let next = src;
  next = next.replace(/columns="35fr 65fr"/g, `columns="40fr 60fr"`);
  // stack → split light 40/60
  next = next.replace(
    /layout="stack"/g,
    `layout="split"\n        panel="light"\n        columns="40fr 60fr"`
  );
  // If already panel light without columns after our edits... ensure columns
  next = next.replace(
    /panel="light"\n(\s*)>/g,
    (m, sp) => `panel="light"\n${sp}columns="40fr 60fr"\n${sp}>`
  );
  // Deduplicate columns if doubled
  next = next.replace(
    /columns="40fr 60fr"\s*\n\s*columns="40fr 60fr"/g,
    `columns="40fr 60fr"`
  );
  return next;
}

function migrateContent(file, src) {
  const folder = path.relative(toolsRoot, file).split(path.sep)[0];
  const category = FOLDER_CATEGORY[folder] || "calculators";
  const toolPath = guessPath(file, src);

  // Match legacy flex content+related section
  const re =
    /<section\b[^>]*\bcont-text\b[^>]*>\s*<div className="[^"]*(?:md:flex|flex)[^"]*"[\s\S]*?<div className="[^"]*md:w-3\/4[^"]*">([\s\S]*?)<\/div>\s*<div className="[^"]*(?:relatedtools|md:w-1\/4)[^"]*"[\s\S]*?(?:<RelatedTools[\s\S]*?\/>|<ExploreRelatedTools[\s\S]*?\/>)\s*<\/div>\s*<\/div>\s*<\/section>/;

  if (!re.test(src)) {
    return { src, changed: false };
  }

  let next = ensureImport(src, "ToolContentLayout", "../../components/ToolContentLayout");
  next = next.replace(re, (_, left) => {
    return `<ToolContentLayout
        category="${category}"
        currentToolPath="${toolPath}"
      >
${left.trim()}
      </ToolContentLayout>`;
  });

  // Remove unused RelatedTools import if no longer referenced
  if (!next.includes("<RelatedTools") && next.includes("import RelatedTools")) {
    next = next.replace(/import RelatedTools from ["'][^"']+["'];?\n?/g, "");
  }
  if (!next.includes("<ExploreRelatedTools") && next.includes("import ExploreRelatedTools")) {
    next = next.replace(/import ExploreRelatedTools from ["'][^"']+["'];?\n?/g, "");
  }

  return { src: next, changed: true };
}

const results = { hero: 0, content: 0, fail: [] };

for (const file of walk(toolsRoot)) {
  if (/AgeCalculator|BmiCalculator|CalorieCalculator/.test(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  src = migrateHero(src);
  const content = migrateContent(file, src);
  src = content.src;
  if (src !== before) {
    fs.writeFileSync(file, src);
    if (src !== before && before.includes("layout=") || before.includes("columns=")) results.hero++;
    if (content.changed) results.content++;
    console.log("updated", path.relative(toolsRoot, file), content.changed ? "+content" : "");
  }
}

console.log("Done. Files with content migration:", results.content);
