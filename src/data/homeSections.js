import { categories, categoryPopularityRank, tools } from "./toolDefinitions";

export const RECENTLY_ADDED_IDS = [
  "ai-title-generator",
  "prompt-enhancer",
  "seo-audit-ai",
  "code-reviewer",
  "ad-copy-generator",
  "ats-resume-checker",
  "ai-website-auditor",
  "blog-outline-generator",
  "unit-test-generator",
  "keyword-clustering",
  "meeting-notes-summarizer",
  "flashcard-generator",
  "prompt-quality-score",
  "n8n-workflow-generator",
  "alt-text-generator",
  "readability-checker",

  "fd-calculator",
  "nps-calculator",


  "gst-invoice-generator",
  "term-insurance-calculator",
  "credit-card-emi-calculator",


  "income-tax-calculator",
  "home-loan-calculator",
  "fire-calculator",
  "in-hand-salary-calculator",

  "lumpsum-calculator",
  "old-vs-new-tax-regime",

  "retirement-corpus-calculator",
  "tds-calculator",
  "epf-interest-calculator",

  "json-validator",
  "jwt-generator",
  "sha256-generator",
  "curl-generator",
  "javascript-playground",
  "dns-lookup",
  "open-graph-generator",
  "css-flexbox-generator",
  "uuid-generator",
  "html-preview",
  "graphql-explorer",
  "password-strength-checker",
  "url-encode",
  "sql-generator",
  "hreflang-generator",
  "json-to-typescript",
  "json-minifier",
  "json-beautifier",
  "json-pretty-print",
  "json-compare",
  "json-diff-viewer",
  "json-tree-viewer",
  "json-to-xml",
  "xml-to-json",
  "epf-checker",



  "pin-code-post-office-finder",
  "toll-calculator-india",
  "government-scheme-finder",
  "job-notification-tracker",
  "scholarship-finder",
  "electricity-bill-calculator",
  "weather",
  "aqi-checker",
  "government-holidays",
  "festival-calendar",
  "llm-readiness-checker",
  "ifsc-code-finder",
  "trim-text",
  "wrap-text",
  "indent-text",
  "justify-text",
  "sort-lines-az",
  "reverse-lines",
  "shuffle-lines",
  "number-lines",
  "email-rewriter",
  "duplicate-line-remover",
  "code-explainer",
  "documentation-generator",
];

export const COLLECTION_BLURBS = {
  calculators: "Age, EMI, SIP, BMI, and everyday math calculators.",
  "finance-tools": "Mutual funds, loans, tax, salary, banking, and retirement planners.",
  "trending-tools": "India utilities, weather, AQI, PIN codes, and converters.",
  "developer-tools": "JSON, HTML, CSS, API, JWT, encoding, SQL, and coding helpers.",
  "ai-tools": "Writing, SEO, marketing, office, prompts, automation, and website audits.",
  "career-learning": "Resume, interviews, flashcards, quizzes, and study helpers.",
  "business-tools": "GST, invoices, IFSC, EPF, and business utilities.",
  "image-tools": "Resize, convert, OCR, alt text, captions, and image prompts.",
  "pdf-tools": "Merge, convert, compress, and manage PDF files.",
  "text-tools": "Trim, wrap, sort, clean, and transform text fast.",
  "social-media-tools": "Captions, bios, hashtags, and content helpers.",
};

const realTools = () => tools.filter((t) => !t.isPageLink);

/** All site categories for Popular Collections (icons from catalog). */
export const COLLECTION_DEFS = categories.map((cat) => ({
  id: cat.id,
  label: cat.name,
  blurb: COLLECTION_BLURBS[cat.id] || `Browse ${cat.name.toLowerCase()}.`,
  icon: cat.icon,
}));

export function getHomeCategoryList() {
  const list = realTools();
  return [
    { id: "all", label: "All", count: list.length },
    ...categories
      .map((cat) => ({
        id: cat.id,
        label: cat.name.replace(/ Tools$/, ""),
        count: list.filter((t) => t.category === cat.id).length,
      }))
      .filter((c) => c.count > 0)
      .sort(
        (a, b) =>
          categoryPopularityRank(a.id) - categoryPopularityRank(b.id) ||
          b.count - a.count ||
          a.label.localeCompare(b.label)
      ),
  ];
}

/** Static chips without counts — prefer getHomeCategoryList() on Home. */
export const HOME_CATEGORY_LIST = [
  { id: "all", label: "All" },
  ...categories.map((cat) => ({ id: cat.id, label: cat.name.replace(/ Tools$/, "") })),
];

/** High-traffic daily / finance pages surfaced in Home → Trending. */
export const TRENDING_FEATURED_IDS = [
  "ai-title-generator",
  "prompt-enhancer",
  "seo-audit-ai",
  "code-reviewer",
  "ad-copy-generator",
  "ats-resume-checker",
  "ai-website-auditor",


];

export function getTrendingTools(limit = 8) {
  const list = realTools();
  const byId = Object.fromEntries(list.map((t) => [t.id, t]));
  const featured = TRENDING_FEATURED_IDS.map((id) => byId[id]).filter(Boolean);
  const rest = list.filter(
    (t) => t.category === "trending-tools" && !TRENDING_FEATURED_IDS.includes(t.id)
  );
  return [...featured, ...rest].slice(0, limit);
}

export function getRecentlyAddedTools(limit = 8) {
  const byId = Object.fromEntries(realTools().map((t) => [t.id, t]));
  return RECENTLY_ADDED_IDS.map((id) => byId[id]).filter(Boolean).slice(0, limit);
}

export function getCollectionStats() {
  const list = realTools();
  return COLLECTION_DEFS.map((c) => ({
    ...c,
    count: list.filter((t) => t.category === c.id).length,
  }))
    .filter((c) => c.count > 0)
    .sort(
      (a, b) =>
        categoryPopularityRank(a.id) - categoryPopularityRank(b.id) ||
        b.count - a.count ||
        a.label.localeCompare(b.label)
    );
}

export function searchTools(query, limit = 40) {
  const q = query.trim().toLowerCase();
  const list = realTools();
  if (!q) return list.slice(0, limit);

  const scored = list
    .map((tool) => {
      const name = tool.name.toLowerCase();
      const desc = (tool.desc || "").toLowerCase();
      const keywords = (tool.keywords || []).join(" ").toLowerCase();
      let score = 0;
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 60;
      else if (name.includes(q)) score += 40;
      if (keywords.includes(q)) score += 25;
      if (desc.includes(q)) score += 10;
      q.split(/\s+/).forEach((part) => {
        if (part && (name.includes(part) || keywords.includes(part))) score += 5;
      });
      return { tool, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));

  return scored.slice(0, limit).map((row) => row.tool);
}

export { openCommandPalette } from "../utils/openCommandPalette";
