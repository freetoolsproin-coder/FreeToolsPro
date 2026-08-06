/**
 * Generate one blog guide per tool + src/data/toolBlogGuides.js map.
 * Usage: node scripts/generate-tool-blog-guides.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TOOL_DEF = path.join(ROOT, "src/data/toolDefinitions.js");
const BLOG_DIR = path.join(ROOT, "blog/content");
const OUT_MAP = path.join(ROOT, "src/data/toolBlogGuides.js");
const TODAY = new Date().toISOString().slice(0, 10);

const CATEGORY_TO_BLOG = {
  calculators: "guides",
  "finance-tools": "guides",
  "business-tools": "guides",
  "seo-tools": "seo",
  "pdf-tools": "pdf",
  "image-tools": "image-optimization",
  "developer-tools": "programming",
  "text-tools": "tutorials",
  "social-media-tools": "tutorials",
  "trending-tools": "guides",
  "ai-writing-tools": "ai-articles",
  "ai-image-tools": "ai-articles",
  "ai-chat-tools": "ai-articles",
  "ai-coding-tools": "ai-articles",
  "ai-productivity-tools": "ai-articles",
  "ai-resume-tools": "ai-articles",
  "ai-automation-tools": "ai-articles",
  "ai-seo-tools": "ai-articles",
  "ai-tools": "ai-articles",
  "career-learning": "tutorials",
  "security-tools": "guides",
  "conversion-tools": "tutorials",
  "utility-tools": "guides",
  "india-tools": "guides",
};

function blogCategoryFor(toolCategory) {
  if (!toolCategory) return "tutorials";
  if (CATEGORY_TO_BLOG[toolCategory]) return CATEGORY_TO_BLOG[toolCategory];
  if (toolCategory.startsWith("ai-")) return "ai-articles";
  if (toolCategory.includes("seo")) return "seo";
  if (toolCategory.includes("pdf")) return "pdf";
  if (toolCategory.includes("image")) return "image-optimization";
  if (toolCategory.includes("dev") || toolCategory.includes("code")) return "programming";
  return "tutorials";
}

function extractField(block, field) {
  const m = block.match(new RegExp(`${field}:\\s*["']([^"']+)["']`));
  return m ? m[1] : null;
}

function extractKeywords(block) {
  const m = block.match(/keywords:\s*\[([^\]]*)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
}

function parseTools(source) {
  const blocks = source.split(/^\s*\{/m);
  const tools = [];
  for (const block of blocks) {
    const id = extractField(block, "id");
    const toolPath = extractField(block, "path");
    if (!id || !toolPath) continue;
    if (/isPageLink:\s*true/.test(block)) continue;
    if (toolPath.includes("?") || toolPath === "/blog" || toolPath.startsWith("/blog/")) continue;
    tools.push({
      id,
      path: toolPath,
      name: extractField(block, "name") || id,
      desc: extractField(block, "desc") || "",
      category: extractField(block, "category") || "guides",
      keywords: extractKeywords(block),
    });
  }
  return tools;
}

function yamlList(items, indent = 2) {
  const pad = " ".repeat(indent);
  return items.map((i) => `${pad}- ${i}`).join("\n");
}

function escapeYaml(str) {
  return String(str || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

function relatedToolPaths(tool, allTools) {
  const same = allTools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3)
    .map((t) => t.path);
  return [tool.path, ...same];
}

function buildBody(tool, related) {
  const others = related.filter((p) => p !== tool.path);
  const otherLinks = others
    .map((p) => {
      const t = allToolsByPath.get(p);
      return t ? `- [${t.name}](${t.path}) — ${t.desc || "Free online utility."}` : `- [Related tool](${p})`;
    })
    .join("\n");

  const keywordLine = (tool.keywords || []).slice(0, 6).join(", ") || tool.category;

  const descClause = tool.desc
    ? tool.desc.charAt(0).toLowerCase() + tool.desc.slice(1).replace(/\.\s*$/, "")
    : "get a clear result without installing software";

  return `The free [**${tool.name}**](${tool.path}) on FreeToolsPro helps you ${descClause}. Everything runs in your browser—open the tool, enter your inputs, and copy or download the output when you are done.

## When to use the ${tool.name}

Reach for this tool when you need a fast, accurate answer and do not want to build a spreadsheet or sign up for another app. Typical moments:

- You need a result in under a minute for work, study, or everyday planning.
- You want to double-check a number, format, or draft before you share it.
- You prefer a privacy-friendly workflow that keeps data on your device whenever the tool allows.

Search phrases people use around this utility often include: ${keywordLine}.

## How to use ${tool.name} (step by step)

1. Open the [**${tool.name}**](${tool.path}) page on FreeToolsPro.
2. Read the short field labels and enter the values you already know (amounts, dates, text, files, or options).
3. Adjust any optional settings—units, tone, precision, or format—so the output matches how you will use it.
4. Run the calculation or conversion and scan the result for obvious input mistakes.
5. Copy, download, or note the output, then refine inputs if you need a second scenario.

If a field looks optional, try the defaults first. Most FreeToolsPro pages are designed so a sensible first pass works without digging through advanced settings.

## Tips for better results

- **Start with clean inputs.** Wrong dates, missing decimals, or pasted junk text cause most “bad” outputs.
- **Compare two scenarios.** Change one variable at a time (rate, size, tone, or format) so you can see what moved the result.
- **Keep a short checklist.** Write down what “done” means before you open the tool—especially for finance, SEO, or document workflows.
- **Pair with a related utility** when your job spans two steps (for example calculate, then convert; or draft, then check).

## Related FreeToolsPro utilities

${otherLinks || `- Browse more tools in the same category from the [all tools catalog](/tools).`}

## Why a dedicated ${tool.name} guide helps

Tool UIs are optimized for speed. A short guide sits beside them so you remember *why* a field matters and *what* to do with the answer. Bookmark this page if you reuse the workflow weekly; send the live tool link when someone only needs the calculator itself.

## Open the tool

Ready to try it? Launch the [**${tool.name}**](${tool.path}) now—free, no install, and built to work on phone and desktop browsers.
`;
}

const toolSource = fs.readFileSync(TOOL_DEF, "utf8");
const tools = parseTools(toolSource);
const allToolsByPath = new Map(tools.map((t) => [t.path, t]));

/** path → preferred existing slug from relatedTools in current posts */
const existingRelated = new Map();
const existingSlugs = new Set();

for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  existingSlugs.add(slug);
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const fmEnd = raw.indexOf("\n---", 3);
  if (fmEnd === -1) continue;
  const fm = raw.slice(0, fmEnd);
  const related = [...fm.matchAll(/^\s*-\s*(\/[^\s#]+)/gm)].map((m) => m[1]);
  for (const p of related) {
    if (!allToolsByPath.has(p)) continue;
    // Prefer shorter, more specific existing guides; keep first if already set unless current is *-guide for that tool
    const tool = allToolsByPath.get(p);
    const dedicated = `${tool.id}-guide`;
    if (slug === dedicated) {
      existingRelated.set(p, slug);
      continue;
    }
    if (!existingRelated.has(p)) existingRelated.set(p, slug);
  }
}

function buildMarkdown(tool, related) {
  const slug = `${tool.id}-guide`;
  const blogCat = blogCategoryFor(tool.category);
  const tags = Array.from(
    new Set([...(tool.keywords || []).slice(0, 5), tool.category, "freetoolspro"].filter(Boolean))
  ).slice(0, 8);
  const title = `How to Use the ${tool.name} (Free Online Guide)`;
  const description =
    tool.desc ||
    `Learn how to use the free ${tool.name} on FreeToolsPro—steps, tips, and related tools.`;
  const body = buildBody(tool, related);
  return `---
title: "${escapeYaml(title)}"
description: "${escapeYaml(description)}"
slug: ${slug}
category: ${blogCat}
date: ${TODAY}
tags:
${yamlList(tags)}
relatedTools:
${yamlList(related)}
---

${body}`;
}

const guideMap = {};
let written = 0;
let skippedExisting = 0;

for (const tool of tools) {
  const slug = `${tool.id}-guide`;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const related = relatedToolPaths(tool, tools);

  if (fs.existsSync(filePath)) {
    skippedExisting += 1;
  } else {
    fs.writeFileSync(filePath, buildMarkdown(tool, related), "utf8");
    written += 1;
  }

  // Prefer dedicated *-guide; else fall back to an existing post that lists this tool
  if (existingSlugs.has(slug) || fs.existsSync(filePath)) {
    guideMap[tool.path] = slug;
  } else if (existingRelated.has(tool.path)) {
    guideMap[tool.path] = existingRelated.get(tool.path);
  } else {
    guideMap[tool.path] = slug;
  }
}

const sortedPaths = Object.keys(guideMap).sort();
const mapBody = sortedPaths.map((p) => `  ${JSON.stringify(p)}: ${JSON.stringify(guideMap[p])},`).join("\n");

const mapFile = `/**
 * Auto-generated by scripts/generate-tool-blog-guides.mjs
 * Maps tool path → blog post slug (blog.freetoolspro.in/<slug> or /blog/<slug> locally).
 */
export const TOOL_BLOG_GUIDES = {
${mapBody}
};

export function getToolBlogGuideSlug(toolPath) {
  if (!toolPath) return null;
  return TOOL_BLOG_GUIDES[toolPath] || null;
}
`;

fs.writeFileSync(OUT_MAP, mapFile, "utf8");

console.log(
  JSON.stringify(
    {
      tools: tools.length,
      written,
      skippedExistingFile: skippedExisting,
      mapEntries: sortedPaths.length,
      outMap: OUT_MAP,
      blogDir: BLOG_DIR,
    },
    null,
    2
  )
);
