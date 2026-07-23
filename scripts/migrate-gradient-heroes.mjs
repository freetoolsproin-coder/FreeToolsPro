/**
 * Pass 2: migrate slate-950 gradient hero sections → ToolHeroShell
 * Run: node scripts/migrate-gradient-heroes.mjs
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

const GRADIENT =
  'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-10 px-4';

const TARGETS = [
  "business-tools/GstCalculator.jsx",
  "business-tools/SalaryCalculator.jsx",
  "developer-tools/DateDiff.jsx",
  "developer-tools/IpLookup.jsx",
  "developer-tools/IPAddress.jsx",
  "developer-tools/SitemapGenerator.jsx",
  "developer-tools/RobotsTxtGenerator.jsx",
  "developer-tools/UseSpeedTest.jsx",
  "developer-tools/PlagiarismChecker.jsx",
  "developer-tools/TimestampConverter.jsx",
  "developer-tools/PythonFormatter.jsx",
  "image-tools/Base64Encoder.jsx",
  "image-tools/AllInOneImageToolkit.jsx",
  "image-tools/ImageToText.jsx",
  "social-media-tools/AIInstagramCaptionGenerator.jsx",
  "social-media-tools/InstagramDownloader.jsx",
  "trending/ColorPicker.jsx",
  "trending/CurrencyConverter.jsx",
  "trending/FancyTextGenerator.jsx",
  "trending/QrCodeGenerator.jsx",
  "trending/QrCodeScanner.jsx",
  "trending/UnitConverter.jsx",
  "text-tools/DateAddSubtractCalculator.jsx",
];

function stripTags(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMatchingClose(src, openIdx) {
  // Find the `<section ...>` start, then matching `</section>` by depth
  const openTagEnd = src.indexOf(">", openIdx);
  if (openTagEnd < 0) return -1;
  let depth = 1;
  let i = openTagEnd + 1;
  const re = /<\/?section\b[^>]*>/gi;
  re.lastIndex = i;
  let m;
  while ((m = re.exec(src))) {
    if (m[0].startsWith("</")) {
      depth--;
      if (depth === 0) return m.index;
    } else {
      depth++;
    }
  }
  return -1;
}

function ensureImports(src, iconName, importPath) {
  let next = src;
  if (!next.includes("ToolHeroShell")) {
    if (next.includes(`from "${importPath}/Seo"`) || next.includes(`from '${importPath}/Seo'`)) {
      next = next.replace(
        new RegExp(`from ["']${importPath.replace(/\./g, "\\.")}/Seo["'];?`),
        (m) => `${m}\nimport ToolHeroShell from "${importPath}/ToolHeroShell";`
      );
    } else {
      next = `import ToolHeroShell from "${importPath}/ToolHeroShell";\n` + next;
    }
  }

  const lucideMatch = next.match(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/);
  if (lucideMatch) {
    const names = lucideMatch[1].split(",").map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    if (!names.includes(iconName)) {
      const raw = lucideMatch[1].trim().replace(/,\s*$/, "");
      next = next.replace(
        lucideMatch[0],
        `import { ${raw}, ${iconName} } from "lucide-react"`
      );
    }
  } else {
    next = `import { ${iconName} } from "lucide-react";\n` + next;
  }
  return next;
}

function migrate(relPath) {
  const filePath = path.join(toolsRoot, relPath);
  if (!fs.existsSync(filePath)) return { status: "missing", relPath };

  let src = fs.readFileSync(filePath, "utf8");
  if (src.includes("<ToolHeroShell")) return { status: "skip", relPath };
  if (!src.includes(GRADIENT)) return { status: "no-gradient", relPath };

  const folder = relPath.split("/")[0];
  const category = FOLDER_CATEGORY[folder] || "calculators";
  const iconName = FALLBACK_ICON[category] || "Sparkles";
  const importPath = "../../components";

  const openIdx = src.indexOf(`className="${GRADIENT}"`);
  if (openIdx < 0) return { status: "no-gradient", relPath };

  // Walk back to `<section`
  const sectionStart = src.lastIndexOf("<section", openIdx);
  if (sectionStart < 0) return { status: "fail", relPath, reason: "no-section-start" };

  const sectionClose = findMatchingClose(src, sectionStart);
  if (sectionClose < 0) return { status: "fail", relPath, reason: "no-section-close" };

  const sectionBlock = src.slice(sectionStart, sectionClose + "</section>".length);

  // Extract title/subtitle from first text-center block
  const centerMatch = sectionBlock.match(
    /<div className="text-center">([\s\S]*?)<\/div>/
  );
  let title = "Tool";
  let subtitle = "Fast, private, and free in your browser.";
  if (centerMatch) {
    const h = centerMatch[1].match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);
    const p = centerMatch[1].match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (h) title = stripTags(h[1]);
    if (p) subtitle = stripTags(p[1]);
  }

  // Inner content: everything inside the mx-auto wrapper after text-center
  const innerOpen = sectionBlock.match(
    /<div className="sm:w-\[\d+%\][^"]*mx-auto[^"]*">/
  );
  let panelHtml;
  if (innerOpen) {
    const afterInnerOpen = sectionBlock.indexOf(innerOpen[0]) + innerOpen[0].length;
    // strip leading text-center if present
    let body = sectionBlock.slice(afterInnerOpen);
    // remove trailing </div></section> wrappers — find last </div> before </section>
    body = body.replace(/\s*<\/div>\s*<\/section>\s*$/, "");
    if (centerMatch) {
      body = body.replace(centerMatch[0], "").trim();
    }
    panelHtml = body;
  } else {
    // fallback: use everything after text-center inside section
    const afterCenter = centerMatch
      ? sectionBlock.indexOf(centerMatch[0]) + centerMatch[0].length
      : sectionBlock.indexOf(">") + 1;
    panelHtml = sectionBlock
      .slice(afterCenter)
      .replace(/\s*<\/div>\s*<\/section>\s*$/, "")
      .replace(/\s*<\/section>\s*$/, "")
      .trim();
  }

  const replacement = `<ToolHeroShell
        category="${category}"
        icon={${iconName}}
        title="${title.replace(/"/g, '\\"')}"
        subtitle="${subtitle.replace(/"/g, '\\"')}"
        formLabel="Start here"
      >
${panelHtml}
      </ToolHeroShell>`;

  src = src.slice(0, sectionStart) + replacement + src.slice(sectionClose + "</section>".length);
  src = ensureImports(src, iconName, importPath);

  fs.writeFileSync(filePath, src);
  return { status: "updated", relPath, title };
}

const results = { updated: [], failed: [], skipped: [] };
for (const t of TARGETS) {
  const r = migrate(t);
  if (r.status === "updated") results.updated.push(`${r.relPath} → ${r.title}`);
  else if (r.status === "skip" || r.status === "no-gradient" || r.status === "missing")
    results.skipped.push(`${r.relPath} (${r.status})`);
  else results.failed.push(`${r.relPath} (${r.reason || r.status})`);
}

console.log("UPDATED", results.updated.length);
results.updated.forEach((x) => console.log("  +", x));
console.log("FAILED", results.failed.length);
results.failed.forEach((x) => console.log("  !", x));
console.log("SKIPPED", results.skipped.length);
results.skipped.forEach((x) => console.log("  ~", x));
