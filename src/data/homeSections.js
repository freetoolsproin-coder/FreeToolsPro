import { categories, tools } from "./toolDefinitions";

export const RECENTLY_ADDED_IDS = [
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
  calculators: "Age, EMI, SIP, BMI, and finance math.",
  "trending-tools": "Password, QR, converters, and everyday utilities.",
  "social-media-tools": "Captions, bios, resumes, and content helpers.",
  "developer-tools": "YAML, SQL, CSV, regex, and SEO utilities.",
  "business-tools": "GST, salary, invoices, and payroll basics.",
  "image-tools": "Resize, convert, OCR, and visual utilities.",
  "pdf-tools": "Merge, convert, and manage PDF files.",
  "text-tools": "Trim, wrap, sort, number lines, and clean copy.",
};

/** All site categories for Popular Collections (icons from catalog). */
export const COLLECTION_DEFS = categories.map((cat) => ({
  id: cat.id,
  label: cat.name,
  blurb: COLLECTION_BLURBS[cat.id] || `Browse ${cat.name.toLowerCase()}.`,
  icon: cat.icon,
}));

export const HOME_CATEGORY_LIST = [
  { id: "all", label: "All" },
  ...categories.map((cat) => ({ id: cat.id, label: cat.name.replace(/ Tools$/, "") })),
];

const realTools = () => tools.filter((t) => !t.isPageLink);

export function getTrendingTools(limit = 8) {
  return realTools()
    .filter((t) => t.category === "trending-tools")
    .slice(0, limit);
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
  })).filter((c) => c.count > 0);
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

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("ftp:open-command-palette"));
}
