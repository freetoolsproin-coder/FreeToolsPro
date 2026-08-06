/**
 * Club tool categories into ≤12 home/filter groups.
 * Keeps URL paths unchanged; only remaps tool.category + categories[].
 * node scripts/consolidate-categories.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** old category id → new parent id */
const REMAP = {
  // Finance & Investing
  "stock-calculators": "finance-tools",
  "mutual-fund-tools": "finance-tools",
  "loan-calculators": "finance-tools",
  "tax-tools": "finance-tools",
  "salary-hr": "finance-tools",
  "retirement-tools": "finance-tools",
  "banking-tools": "finance-tools",
  "insurance-tools": "finance-tools",
  "business-finance": "finance-tools",
  "market-daily": "finance-tools",

  // Developer
  "json-tools": "developer-tools",
  "html-tools": "developer-tools",
  "css-tools": "developer-tools",
  "javascript-tools": "developer-tools",
  "api-tools": "developer-tools",
  "jwt-tools": "developer-tools",
  "encoding-tools": "developer-tools",
  "hash-tools": "developer-tools",
  "security-tools": "developer-tools",
  "http-tools": "developer-tools",
  "ai-dev-tools": "developer-tools",
  "ai-coding-tools": "developer-tools",
  "ai-data-tools": "developer-tools",

  // AI Tools
  "ai-writing-tools": "ai-tools",
  "ai-seo-tools": "ai-tools",
  "ai-marketing-tools": "ai-tools",
  "ai-office-tools": "ai-tools",
  "ai-prompt-engineering": "ai-tools",
  "ai-automation-tools": "ai-tools",
  "ai-website-auditor": "ai-tools",

  // Career & Learning
  "ai-resume-career": "career-learning",
  "ai-learning-tools": "career-learning",

  // Image
  "ai-image-helpers": "image-tools",
};

const NEW_CATEGORIES = [
  { id: "calculators", name: "Calculators", icon: "Calculator", path: "/calculators" },
  { id: "finance-tools", name: "Finance & Investing", icon: "CandlestickChart", path: "/tools?cat=finance-tools" },
  { id: "trending-tools", name: "Daily Utilities", icon: "Flame", path: "/trending-tools" },
  { id: "developer-tools", name: "Developer Tools", icon: "Code2", path: "/developer-tools" },
  { id: "ai-tools", name: "AI Tools", icon: "Sparkles", path: "/tools?cat=ai-tools" },
  { id: "seo-tools", name: "SEO Tools", icon: "Search", path: "/seo-tools" },
  { id: "career-learning", name: "Career & Learning", icon: "GraduationCap", path: "/tools?cat=career-learning" },
  { id: "business-tools", name: "Business Tools", icon: "BriefcaseBusiness", path: "/business-tools" },
  { id: "image-tools", name: "Image Tools", icon: "Image", path: "/image-tools" },
  { id: "pdf-tools", name: "PDF Tools", icon: "FileText", path: "/pdf-tools" },
  { id: "text-tools", name: "Text Tools", icon: "Type", path: "/text-tools" },
  { id: "social-media-tools", name: "Social Media Tools", icon: "Share2", path: "/social-media-tools" },
];

const BLURBS = {
  calculators: "Age, EMI, SIP, BMI, and everyday math calculators.",
  "finance-tools": "Stocks, mutual funds, loans, tax, salary, banking, and market daily.",
  "trending-tools": "India utilities, weather, AQI, gold, petrol, and converters.",
  "developer-tools": "JSON, HTML, CSS, API, JWT, encoding, SQL, and coding helpers.",
  "ai-tools": "Writing, SEO, marketing, office, prompts, automation, and audits.",
  "seo-tools": "Meta tags, schema, sitemaps, robots.txt, and on-page SEO utilities.",
  "career-learning": "Resume, interviews, flashcards, quizzes, and study helpers.",
  "business-tools": "GST, invoices, IFSC, EPF, and business utilities.",
  "image-tools": "Resize, convert, OCR, alt text, captions, and image prompts.",
  "pdf-tools": "Merge, convert, compress, and manage PDF files.",
  "text-tools": "Trim, wrap, sort, clean, and transform text fast.",
  "social-media-tools": "Captions, bios, hashtags, and content helpers.",
};

function patchDefinitions() {
  const p = path.join(ROOT, "src/data/toolDefinitions.js");
  let text = fs.readFileSync(p, "utf8");

  // Remap tool categories (only the category: "..." field lines)
  for (const [from, to] of Object.entries(REMAP)) {
    const re = new RegExp(`(category: ")${from}(")`, "g");
    text = text.replace(re, `$1${to}$2`);
  }

  const catsBlock = NEW_CATEGORIES.map(
    (c) => `  {
    id: "${c.id}",
    name: "${c.name}",
    icon: ${c.icon},
    path: "${c.path}",
  },`
  ).join("\n");

  text = text.replace(
    /export const categories = \[[\s\S]*?\];\n\n\/\* ===========================\n   Tools/,
    `export const categories = [\n${catsBlock}\n];\n\n/* ===========================\n   Tools`
  );

  fs.writeFileSync(p, text, "utf8");
  console.log("patched toolDefinitions categories + remaps");
}

function patchThemes() {
  const p = path.join(ROOT, "src/data/categoryThemes.js");
  let text = fs.readFileSync(p, "utf8");

  // Ensure parent themes exist
  if (!text.includes('"finance-tools":')) {
    text = text.replace(
      /  "ai-tools": \{[\s\S]*?hint: "Intelligent helpers",\n  \},/,
      `  "ai-tools": {
    id: "ai-tools",
    label: "AI Tools",
    accent: "#5eead4",
    accentSoft: "rgba(94, 234, 212, 0.16)",
    glowA: "rgba(94, 234, 212, 0.18)",
    glowB: "rgba(56, 189, 248, 0.12)",
    hint: "Intelligent helpers",
  },
  "finance-tools": {
    id: "finance-tools",
    label: "Finance",
    accent: "#14b8a6",
    accentSoft: "rgba(20, 184, 166, 0.16)",
    glowA: "rgba(56, 189, 248, 0.18)",
    glowB: "rgba(13, 148, 136, 0.2)",
    hint: "Markets & money",
  },
  "career-learning": {
    id: "career-learning",
    label: "Career & Learning",
    accent: "#2dd4bf",
    accentSoft: "rgba(45, 212, 191, 0.16)",
    glowA: "rgba(45, 212, 191, 0.16)",
    glowB: "rgba(56, 189, 248, 0.12)",
    hint: "Grow skills & career",
  },`
    );
  }

  // Point folder aliases at parent categories for normalize fallback
  const folderMap = {
    ...Object.fromEntries(Object.entries(REMAP)),
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
    "seo-tools": "seo-tools",
    "finance-tools": "finance-tools",
    "career-learning": "career-learning",
  };

  const folderBlock = Object.entries(folderMap)
    .map(([k, v]) => `  "${k}": "${v}",`)
    .join("\n");

  text = text.replace(
    /const FOLDER_TO_CATEGORY = \{[\s\S]*?\n\};/,
    `const FOLDER_TO_CATEGORY = {\n${folderBlock}\n};`
  );

  // PATH_PREFIXES → parent for any code that uses categoryFromPath for grouping
  const prefixLines = [
    ...NEW_CATEGORIES.filter((c) => c.path.startsWith("/") && !c.path.includes("?")).map(
      (c) => `  ["${c.path.endsWith("/") ? c.path : c.path + "/"}", "${c.id}"],`
    ),
    ...Object.entries(REMAP).map(
      ([from, to]) => `  ["/${from}/", "${to}"],`
    ),
    `  ["/trending/", "trending-tools"],`,
  ];
  // de-dupe
  const seen = new Set();
  const unique = prefixLines.filter((line) => {
    const m = line.match(/\["([^"]+)"/);
    if (!m || seen.has(m[1])) return false;
    seen.add(m[1]);
    return true;
  });

  text = text.replace(
    /const PATH_PREFIXES = \[[\s\S]*?\];/,
    `const PATH_PREFIXES = [\n${unique.join("\n")}\n];`
  );

  // normalizeCategory: prefer folder map so old folder ids resolve to parents when used as category
  // Keep existing themes for tool heroes (distinct accents). categoryFromPath returns parent.

  fs.writeFileSync(p, text, "utf8");
  console.log("patched categoryThemes");
}

function patchHome() {
  const p = path.join(ROOT, "src/data/homeSections.js");
  let text = fs.readFileSync(p, "utf8");

  const blurbs = Object.entries(BLURBS)
    .map(([id, blurb]) => `  ${JSON.stringify(id)}: ${JSON.stringify(blurb)},`)
    .join("\n");

  text = text.replace(
    /export const COLLECTION_BLURBS = \{[\s\S]*?\n\};/,
    `export const COLLECTION_BLURBS = {\n${blurbs}\n};`
  );

  // Sort collections by count desc in getCollectionStats
  if (!text.includes(".sort((a, b) => b.count - a.count)")) {
    text = text.replace(
      /\.filter\(\(c\) => c\.count > 0\);/,
      `.filter((c) => c.count > 0)\n    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));`
    );
  }

  fs.writeFileSync(p, text, "utf8");
  console.log("patched homeSections blurbs");
}

patchDefinitions();
patchThemes();
patchHome();
console.log("DONE");
