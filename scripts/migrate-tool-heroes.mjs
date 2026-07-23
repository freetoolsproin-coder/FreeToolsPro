/**
 * Migrate tool-stage heroes → ToolHeroShell (Age Calculator pattern).
 * Run: node scripts/migrate-tool-heroes.mjs
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

const FALLBACK_ICON = {
  calculators: "Calculator",
  "business-tools": "Briefcase",
  "developer-tools": "Code2",
  "image-tools": "Image",
  "pdf-tools": "FileText",
  "social-media-tools": "Sparkles",
  "text-tools": "Type",
  "trending-tools": "Zap",
  "ai-tools": "Sparkles",
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".jsx")) out.push(full);
  }
  return out;
}

function extractTitleSubtitle(block) {
  const h1 =
    block.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ||
    "Tool";
  const sub =
    block.match(/<p className="[^"]*text-slate-300[^"]*"[^>]*>\s*([\s\S]*?)\s*<\/p>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ||
    block.match(/<p className="[^"]*slate-400[^"]*"[^>]*>\s*([\s\S]*?)\s*<\/p>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ||
    "Fast, private, and free in your browser.";
  return { title: h1.replace(/\s+/g, " "), subtitle: sub.replace(/\s+/g, " ") };
}

function ensureImports(src, iconName) {
  let next = src;
  if (!next.includes("ToolHeroShell")) {
    // Prefer inserting after Seo import
    if (next.includes('from "../../components/Seo"')) {
      next = next.replace(
        /from ["']\.\.\/\.\.\/components\/Seo["'];?/,
        (m) =>
          `${m}\nimport ToolHeroShell from "../../components/ToolHeroShell";`
      );
    } else if (next.includes("from '../components/Seo'")) {
      next = next.replace(
        /from ['"]\.\.\/components\/Seo['"];?/,
        (m) => `${m}\nimport ToolHeroShell from "../components/ToolHeroShell";`
      );
    } else {
      next = `import ToolHeroShell from "../../components/ToolHeroShell";\n` + next;
    }
  }

  // Ensure icon in lucide import
  const lucideMatch = next.match(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/);
  if (lucideMatch) {
    const names = lucideMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
    if (!names.includes(iconName)) {
      names.push(iconName);
      next = next.replace(
        lucideMatch[0],
        `import { ${names.join(", ")} } from "lucide-react"`
      );
    }
  } else {
    next = `import { ${iconName} } from "lucide-react";\n` + next;
  }
  return next;
}

function migrateFile(filePath) {
  let src = fs.readFileSync(filePath, "utf8");
  if (!src.includes("tool-stage") || src.includes("<ToolHeroShell")) {
    return { file: filePath, status: "skip" };
  }

  const rel = path.relative(toolsRoot, filePath);
  const folder = rel.split(path.sep)[0];
  const category = FOLDER_CATEGORY[folder] || "calculators";
  const iconName = FALLBACK_ICON[category] || "Sparkles";

  // Match tool-stage section through closing of first hero section carefully
  const stageRe =
    /<section\s+className="[^"]*tool-stage[^"]*"[\s\S]*?>\s*<div className="mx-auto[^"]*"[\s\S]*?>\s*(?:<div className="text-center">[\s\S]*?<\/div>\s*)?<div className="tool-stage__panel[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;

  const m = src.match(stageRe);
  if (!m) {
    // Try without text-center block (title may be elsewhere)
    const altRe =
      /<section\s+className="[^"]*tool-stage[^"]*"[\s\S]*?>\s*<div className="mx-auto[^"]*"[\s\S]*?>\s*<div className="tool-stage__panel[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
    const m2 = src.match(altRe);
    if (!m2) {
      return { file: filePath, status: "fail-parse" };
    }
    const panel = m2[1];
    const headBlock = m2[0].slice(0, 800);
    const { title, subtitle } = extractTitleSubtitle(headBlock);
    src = ensureImports(src, iconName);
    const replacement = `<ToolHeroShell
        category="${category}"
        icon={${iconName}}
        title="${title.replace(/"/g, '\\"')}"
        subtitle="${subtitle.replace(/"/g, '\\"')}"
        formLabel="Calculate"
      >
${panel}
      </ToolHeroShell>`;
    src = src.replace(altRe, replacement);
    fs.writeFileSync(filePath, src);
    return { file: filePath, status: "updated", title };
  }

  const panel = m[1];
  const { title, subtitle } = extractTitleSubtitle(m[0]);
  src = ensureImports(src, iconName);
  const replacement = `<ToolHeroShell
        category="${category}"
        icon={${iconName}}
        title="${title.replace(/"/g, '\\"')}"
        subtitle="${subtitle.replace(/"/g, '\\"')}"
        formLabel="Calculate"
      >
${panel}
      </ToolHeroShell>`;
  src = src.replace(stageRe, replacement);
  fs.writeFileSync(filePath, src);
  return { file: filePath, status: "updated", title };
}

const files = walk(toolsRoot);
const results = { updated: [], skipped: [], failed: [] };

for (const f of files) {
  try {
    const r = migrateFile(f);
    if (r.status === "updated") results.updated.push(path.relative(toolsRoot, f) + ` → ${r.title}`);
    else if (r.status === "fail-parse") results.failed.push(path.relative(toolsRoot, f));
    else results.skipped.push(path.relative(toolsRoot, f));
  } catch (e) {
    results.failed.push(path.relative(toolsRoot, f) + ": " + e.message);
  }
}

console.log("UPDATED", results.updated.length);
results.updated.forEach((x) => console.log("  +", x));
console.log("FAILED", results.failed.length);
results.failed.forEach((x) => console.log("  !", x));
console.log("SKIPPED (no tool-stage / already shell)", results.skipped.length);
