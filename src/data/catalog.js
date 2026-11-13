import { CATEGORIES, categoryById } from "./categories.js";
import finance from "./tools/finance.js";
import tax from "./tools/tax.js";
import everyday from "./tools/everyday.js";
import text from "./tools/text.js";
import developer from "./tools/developer.js";
import encoding from "./tools/encoding.js";
import { image, pdf } from "./tools/media.js";
import design from "./tools/design.js";
import seo from "./tools/seo.js";
import writing from "./tools/writing.js";
import creator from "./tools/creator.js";
import student from "./tools/student.js";
import study from "./tools/study.js";
import latex from "./tools/latex.js";
import { PRIORITY } from "./priority.js";
import SEO_OVERRIDES from "./seo-overrides.js";

const groups = { finance, tax, everyday, student, study, latex, text, writing, developer, encoding, seo, image, creator, pdf, design };

const RANK = Object.fromEntries(PRIORITY.map((id, i) => [id, i + 1]));

/** Every tool, highest priority first (see priority.js). `rank` is 1 for the top tool. */
// Title, description, quick answer and extra FAQs written by scripts/automation/seo-refresh.mjs
// (see seo-overrides.js). The hand-written copy in tools/*.js stays the fallback.
function withOverrides(t) {
  const o = SEO_OVERRIDES[t.id];
  if (!o) return t;
  return {
    ...t,
    ...(o.title ? { title: o.title } : {}),
    ...(o.description ? { description: o.description } : {}),
    ...(o.answer ? { answer: o.answer } : {}),
    ...(o.faqs?.length ? { faqs: [...t.faqs, ...o.faqs] } : {}),
    ...(o.updated ? { updated: o.updated } : {}),
  };
}

export const TOOLS = Object.entries(groups)
  .flatMap(([cat, list]) => list.map((t) => ({ ...withOverrides(t), cat, rank: RANK[t.id] ?? PRIORITY.length + 1 })))
  .sort((a, b) => a.rank - b.rank);

// Safety cap for scripts/check-catalog.mjs. Raise it when the catalogue grows past it.
export const MAX_TOOLS = 150;

export const toolById = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
export const toolByPath = Object.fromEntries(TOOLS.map((t) => [t.path, t]));

export function toolsIn(catId) {
  return TOOLS.filter((t) => t.cat === catId);
}

export const POPULAR = TOOLS.filter((t) => t.popular);

// Hand-picked cross-category links, so related tools are not only siblings.
const CROSS = {
  "emi-calculator": ["home-loan-calculator", "loan-prepayment-calculator", "loan-eligibility-calculator"],
  "home-loan-calculator": ["loan-eligibility-calculator", "loan-prepayment-calculator", "old-vs-new-tax-regime"],
  "sip-calculator": ["goal-planner", "lumpsum-calculator", "inflation-calculator"],
  "income-tax-calculator": ["old-vs-new-tax-regime", "hra-calculator", "in-hand-salary-calculator"],
  "in-hand-salary-calculator": ["income-tax-calculator", "pf-calculator", "gratuity-calculator"],
  "gst-calculator": ["profit-margin-calculator", "percentage-calculator", "break-even-calculator"],
  "image-compressor": ["image-resizer", "jpg-to-pdf", "image-format-converter"],
  "image-resizer": ["image-compressor", "image-cropper", "jpg-to-pdf"],
  "jpg-to-pdf": ["image-compressor", "pdf-merger", "pdf-to-jpg"],
  "json-formatter": ["json-validator", "json-to-csv", "json-to-typescript"],
  "word-counter": ["character-counter", "keyword-density-checker", "case-converter"],
  "meta-tag-generator": ["open-graph-generator", "robots-generator", "slug-generator"],
  "password-generator": ["password-strength-checker", "uuid-generator", "sha256-generator"],
  "jwt-decoder": ["base64-decode", "timestamp-converter", "json-formatter"],
  "compress-pdf": ["image-compressor", "pdf-merger", "jpg-to-pdf"],
  "reorder-pdf-pages": ["pdf-merger", "pdf-splitter", "rotate-pdf"],
  "pdf-to-text": ["word-counter", "text-summarizer", "pdf-to-jpg"],
  "javascript-minifier": ["css-minifier", "html-minifier", "json-minifier"],
  "html-minifier": ["css-minifier", "javascript-minifier", "markdown-to-html"],
  "css-minifier": ["javascript-minifier", "css-beautifier", "html-minifier"],
  "serp-snippet-preview": ["meta-title-description-checker", "meta-tag-generator", "keyword-density-checker"],
  "meta-title-description-checker": ["serp-snippet-preview", "meta-tag-generator", "character-counter"],
  "open-graph-preview": ["open-graph-generator", "og-image-generator", "meta-tag-generator"],
  "open-graph-generator": ["open-graph-preview", "og-image-generator", "meta-tag-generator"],
  "robots-txt-tester": ["robots-generator", "sitemap-validator", "canonical-checker"],
  "robots-generator": ["robots-txt-tester", "sitemap-validator", "meta-tag-generator"],
  "canonical-checker": ["http-header-checker", "meta-tag-generator", "url-parser"],
  "http-header-checker": ["canonical-checker", "url-parser", "robots-txt-tester"],
  "text-summarizer": ["word-counter", "meeting-notes-organizer", "keyword-density-checker"],
  "email-writer": ["resume-bullet-improver", "word-counter", "case-converter"],
  "resume-bullet-improver": ["email-writer", "word-counter", "character-counter"],
  "prompt-builder": ["json-formatter", "regex-tester", "text-summarizer"],
  "youtube-thumbnail-maker": ["youtube-title-description-helper", "social-media-image-resizer", "image-compressor"],
  "youtube-title-description-helper": ["youtube-thumbnail-maker", "hashtag-organizer", "youtube-money-calculator"],
  "og-image-generator": ["open-graph-generator", "open-graph-preview", "social-media-image-resizer"],
  "social-media-image-resizer": ["image-compressor", "image-cropper", "youtube-thumbnail-maker"],
  "cgpa-to-percentage-calculator": ["cgpa-calculator", "marks-grade-calculator", "percentage-calculator"],
  "cgpa-calculator": ["gpa-calculator", "cgpa-to-percentage-calculator", "marks-grade-calculator"],
  "gpa-calculator": ["cgpa-calculator", "cgpa-to-percentage-calculator", "percentage-calculator"],
  "marks-grade-calculator": ["cgpa-to-percentage-calculator", "percentage-calculator", "gpa-calculator"],
  "attendance-calculator": ["percentage-calculator", "exam-countdown", "marks-grade-calculator"],
  "exam-countdown": ["revision-plan-generator", "study-hours-planner", "attendance-calculator"],
  "study-hours-planner": ["revision-plan-generator", "exam-countdown", "attendance-calculator"],
  "notes-summarizer": ["flashcard-generator", "quiz-generator", "concept-explainer"],
  "flashcard-generator": ["quiz-generator", "notes-summarizer", "revision-plan-generator"],
  "quiz-generator": ["flashcard-generator", "notes-summarizer", "concept-explainer"],
  "concept-explainer": ["notes-summarizer", "flashcard-generator", "quiz-generator"],
  "revision-plan-generator": ["exam-countdown", "study-hours-planner", "flashcard-generator"],
  "latex-equation-editor": ["latex-symbol-generator", "latex-equation-to-image", "latex-equation-to-word"],
  "latex-symbol-generator": ["latex-equation-editor", "latex-formula-library", "latex-matrix-generator"],
  "latex-matrix-generator": ["latex-equation-editor", "latex-table-generator", "latex-symbol-generator"],
  "latex-equation-to-image": ["latex-equation-editor", "image-to-latex", "image-compressor"],
  "latex-table-generator": ["latex-matrix-generator", "csv-to-json", "latex-to-pdf"],
  "latex-code-formatter": ["latex-to-pdf", "latex-templates", "markdown-to-html"],
  "image-to-latex": ["latex-equation-editor", "latex-equation-to-image", "mathml-to-latex"],
  "latex-templates": ["latex-to-pdf", "resume-bullet-improver", "latex-code-formatter"],
  "latex-formula-library": ["latex-equation-editor", "latex-symbol-generator", "percentage-calculator"],
  "mathml-to-latex": ["latex-equation-editor", "image-to-latex", "latex-equation-to-word"],
  "latex-to-pdf": ["latex-templates", "latex-code-formatter", "pdf-merger"],
  "latex-equation-to-word": ["latex-equation-editor", "latex-to-pdf", "mathml-to-latex"],
  "working-days-calculator": ["date-difference", "date-add-subtract-calculator", "time-duration-calculator"],
  "time-duration-calculator": ["working-days-calculator", "date-difference", "timestamp-converter"],
};

export function relatedTools(tool, n = 6) {
  const picked = (CROSS[tool.id] || []).map((id) => toolById[id]).filter(Boolean);
  const siblings = toolsIn(tool.cat).filter((t) => t.id !== tool.id && !picked.includes(t));
  // Rotate siblings by the tool's position so every tool gets inbound links, not just the first few.
  const idx = toolsIn(tool.cat).findIndex((t) => t.id === tool.id);
  const rotated = siblings.slice(idx % Math.max(siblings.length, 1)).concat(siblings.slice(0, idx % Math.max(siblings.length, 1)));
  return [...picked, ...rotated].slice(0, n);
}

export { CATEGORIES, categoryById };

// Light-weight index for client-side search (name, short line, path, category name).
export function searchIndex() {
  return TOOLS.map((t) => ({
    n: t.name,
    s: t.short,
    p: t.path,
    c: categoryById[t.cat].name,
    k: t.cat,
    ...(t.popular ? { pop: 1 } : {}),
  }));
}
