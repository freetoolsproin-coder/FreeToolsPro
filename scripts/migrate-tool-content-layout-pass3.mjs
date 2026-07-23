/**
 * Robust pass: wrap cont-text left columns in ToolContentLayout
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
    return src.replace(/(from ["'][^"']*components\/Seo["'];?\r?\n?)/, `$1${line}`);
  }
  return line + src;
}

function guessPath(file, src) {
  const rtp = src.match(/currentToolPath=["']([^"']+)["']/);
  if (rtp) return rtp[1];
  const rel = path.relative(toolsRoot, file).replace(/\\/g, "/");
  const folder = rel.split("/")[0];
  const base = path.basename(file, ".jsx");
  const kebab = base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  return `/${FOLDER_CATEGORY[folder] || folder}/${kebab}`;
}

function findTagOpen(src, classPart, from = 0) {
  const re = new RegExp(
    `<div\\s+(?:className|class)=["'][^"']*${classPart}[^"']*["'][^>]*>`,
    "i"
  );
  re.lastIndex = from;
  const m = re.exec(src);
  return m ? { index: m.index, end: m.index + m[0].length, full: m[0] } : null;
}

function findMatchingCloseDiv(src, openEnd) {
  let depth = 1;
  let i = openEnd;
  while (i < src.length && depth > 0) {
    const nextOpen = src.indexOf("<div", i);
    const nextClose = src.indexOf("</div>", i);
    if (nextClose < 0) return -1;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      // self-closing? treat as open
      const slice = src.slice(nextOpen, nextOpen + 8);
      if (slice.startsWith("<div")) {
        depth++;
        i = nextOpen + 4;
        continue;
      }
    }
    depth--;
    if (depth === 0) return nextClose;
    i = nextClose + 6;
  }
  return -1;
}

function migrate(file) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("<ToolContentLayout")) return false;
  if (!/\bcont-text\b/.test(src)) return false;
  if (!/<RelatedTools\b/.test(src) && !/<ExploreRelatedTools\b/.test(src)) return false;

  const sectionMatch = src.match(/<section\b[^>]*\bcont-text\b[^>]*>/i);
  if (!sectionMatch) return false;
  const sectionStart = sectionMatch.index;
  const sectionOpenEnd = sectionStart + sectionMatch[0].length;

  const leftOpen = findTagOpen(src, "md:w-3\\/4", sectionOpenEnd);
  if (!leftOpen) {
    console.log("no-left", path.relative(toolsRoot, file));
    return false;
  }

  const relatedIdx = src.search(/<(?:RelatedTools|ExploreRelatedTools)\b/);
  if (relatedIdx < 0 || relatedIdx < leftOpen.end) return false;

  // Find right column open containing relatedtools or md:w-1/4 before RelatedTools
  const rightSearch = src.slice(leftOpen.end, relatedIdx);
  const rightRel = rightSearch.lastIndexOf("relatedtools");
  const rightW = rightSearch.lastIndexOf("md:w-1/4");
  const marker = Math.max(rightRel, rightW);
  if (marker < 0) {
    console.log("no-right", path.relative(toolsRoot, file));
    return false;
  }
  const absMarker = leftOpen.end + marker;
  const rightOpenTagStart = src.lastIndexOf("<div", absMarker);
  if (rightOpenTagStart < 0) return false;
  const rightOpenTagEnd = src.indexOf(">", rightOpenTagStart) + 1;

  const leftHtml = src.slice(leftOpen.end, rightOpenTagStart).trim();

  // Find end of section after RelatedTools
  const afterRelated = src.indexOf("/>", relatedIdx);
  if (afterRelated < 0) return false;
  let i = afterRelated + 2;
  // skip whitespace and closing divs until </section>
  const sectionClose = src.indexOf("</section>", i);
  if (sectionClose < 0) return false;

  const folder = path.relative(toolsRoot, file).split(path.sep)[0];
  const category = FOLDER_CATEGORY[folder] || "calculators";
  const toolPath = guessPath(file, src);

  const replacement = `<ToolContentLayout
        category="${category}"
        currentToolPath="${toolPath}"
      >
${leftHtml}
      </ToolContentLayout>`;

  src = src.slice(0, sectionStart) + replacement + src.slice(sectionClose + "</section>".length);
  src = ensureImport(src);

  if (!src.includes("<RelatedTools") && src.includes("import RelatedTools")) {
    src = src.replace(/import RelatedTools from ["'][^"']+["'];?\r?\n?/g, "");
  }
  if (!src.includes("<ExploreRelatedTools") && src.includes("import ExploreRelatedTools")) {
    src = src.replace(/import ExploreRelatedTools from ["'][^"']+["'];?\r?\n?/g, "");
  }

  fs.writeFileSync(file, src);
  console.log("ok", path.relative(toolsRoot, file));
  return true;
}

let n = 0;
for (const f of walk(toolsRoot)) {
  if (/AgeCalculator|BmiCalculator|CalorieCalculator/.test(f)) continue;
  try {
    if (migrate(f)) n++;
  } catch (e) {
    console.log("err", path.relative(toolsRoot, f), e.message);
  }
}
console.log("total", n);
