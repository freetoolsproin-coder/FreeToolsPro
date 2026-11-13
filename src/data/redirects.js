// Builds the 301 map from every legacy URL that is not in the curated catalog
// to the closest kept tool, or to the most relevant category hub.
import { LEGACY_PATHS } from "./legacy-paths.js";
import { TOOLS } from "./catalog.js";

const kept = new Set(TOOLS.map((t) => t.path));

// Specific dropped tool -> closest kept tool.
const CLOSEST = {
  "/calculators/emi-calculator-amm": "/calculators/emi-calculator",
  "/calculators/mortgage-calculator": "/loan-calculators/home-loan-calculator",
  "/calculators/toll-calculator-india": "/everyday-calculators",
  "/business-tools/salary-calculator": "/salary-hr/in-hand-salary-calculator",
  "/business-tools/payroll-calculator": "/salary-hr/in-hand-salary-calculator",
  "/salary-hr/ctc-calculator": "/salary-hr/in-hand-salary-calculator",
  "/salary-hr/salary-breakup-calculator": "/salary-hr/in-hand-salary-calculator",
  "/salary-hr/bonus-calculator": "/salary-hr/in-hand-salary-calculator",
  "/salary-hr/leave-encashment-calculator": "/salary-hr/in-hand-salary-calculator",
  "/salary-hr/notice-period-calculator": "/developer-tools/date-difference",
  "/salary-hr/epf-interest-calculator": "/salary-hr/pf-calculator",
  "/business-tools/epf-checker": "/salary-hr/pf-calculator",
  "/retirement-tools/epf-pension-estimator": "/salary-hr/pf-calculator",
  "/tax-tools/gst-inclusive-exclusive-calculator": "/business-tools/gst-calculator",
  "/business-finance/gst-invoice-generator": "/business-tools/gst-calculator",
  "/tax-tools/standard-deduction-calculator": "/tax-tools/income-tax-calculator",
  "/tax-tools/section-80c-calculator": "/tax-tools/old-vs-new-tax-regime",
  "/tax-tools/tds-calculator": "/tax-tools/income-tax-calculator",
  "/tax-tools/advance-tax-calculator": "/tax-tools/income-tax-calculator",
  "/tax-tools/capital-gains-tax-calculator": "/tax-tools/income-tax-calculator",
  "/retirement-tools/pension-calculator": "/retirement-tools/retirement-planner",
  "/retirement-tools/safe-withdrawal-rate-calculator": "/mutual-fund-tools/fire-calculator",
  "/mutual-fund-tools/retirement-corpus-calculator": "/retirement-tools/retirement-planner",
  "/mutual-fund-tools/stp-calculator": "/mutual-fund-tools/swp-calculator",
  "/mutual-fund-tools/child-education-planner": "/mutual-fund-tools/goal-planner",
  "/loan-calculators/education-loan-calculator": "/calculators/emi-calculator",
  "/loan-calculators/gold-loan-calculator": "/calculators/emi-calculator",
  "/loan-calculators/business-loan-calculator": "/calculators/emi-calculator",
  "/loan-calculators/balance-transfer-calculator": "/loan-calculators/loan-prepayment-calculator",
  "/banking-tools/savings-interest-calculator": "/banking-tools/compound-interest-calculator",
  "/banking-tools/credit-card-emi-calculator": "/calculators/emi-calculator",
  "/banking-tools/credit-utilization-calculator": "/banking-tools/credit-card-payoff-calculator",
  "/business-finance/depreciation-calculator": "/finance-calculators",
  "/business-finance/business-valuation-calculator": "/business-finance/roi-calculator",
  "/json-tools/json-beautifier": "/developer-tools/json-formatter",
  "/json-tools/json-pretty-print": "/developer-tools/json-formatter",
  "/json-tools/json-tree-viewer": "/developer-tools/json-formatter",
  "/json-tools/json-diff-viewer": "/json-tools/json-compare",
  "/json-tools/json-to-java": "/json-tools/json-to-typescript",
  "/json-tools/json-to-csharp": "/json-tools/json-to-typescript",
  "/json-tools/json-to-go-struct": "/json-tools/json-to-typescript",
  "/json-tools/json-to-dart": "/json-tools/json-to-typescript",
  "/json-tools/json-schema-generator": "/json-tools/json-to-typescript",
  "/html-tools/html-unescape": "/html-tools/html-escape",
  "/html-tools/html-encoder": "/html-tools/html-escape",
  "/html-tools/html-decoder": "/html-tools/html-escape",
  "/html-tools/html-entity-converter": "/html-tools/html-escape",
  "/encoding-tools/html-encode": "/html-tools/html-escape",
  "/encoding-tools/html-decode": "/html-tools/html-escape",
  "/html-tools/html-to-markdown": "/html-tools/markdown-to-html",
  "/css-tools/css-formatter": "/developer-tools/css-beautifier",
  "/css-tools/css-border-radius-generator": "/css-tools/css-shadow-generator",
  "/developer-tools/yaml-formatter": "/developer-tools/yaml-to-json",
  "/developer-tools/yaml-validator": "/developer-tools/yaml-to-json",
  "/developer-tools/sql-beautifier": "/developer-tools/sql-formatter",
  "/developer-tools/sql-minifier": "/developer-tools/sql-formatter",
  "/developer-tools/csv-viewer": "/developer-tools/csv-to-json",
  "/developer-tools/regex-generator": "/developer-tools/regex-tester",
  "/developer-tools/regex-cheat-sheet": "/developer-tools/regex-tester",
  "/developer-tools/regex-explainer": "/developer-tools/regex-tester",
  "/developer-tools/python-formatter": "/developer-tools",
  "/jwt-tools/jwt-encoder": "/developer-tools/jwt-decoder",
  "/jwt-tools/jwt-inspector": "/developer-tools/jwt-decoder",
  "/jwt-tools/jwt-expiry-checker": "/developer-tools/jwt-decoder",
  "/jwt-tools/jwt-generator": "/developer-tools/jwt-decoder",
  "/hash-tools/sha1-generator": "/hash-tools/sha256-generator",
  "/hash-tools/sha512-generator": "/hash-tools/sha256-generator",
  "/hash-tools/hmac-generator": "/hash-tools/sha256-generator",
  "/hash-tools/bcrypt-generator": "/hash-tools/sha256-generator",
  "/hash-tools/uuid-validator": "/hash-tools/uuid-generator",
  "/encoding-tools/unicode-converter": "/encoding-tools/binary-converter",
  "/encoding-tools/utf8-converter": "/encoding-tools/binary-converter",
  "/encoding-tools/ascii-converter": "/encoding-tools/binary-converter",
  "/encoding-tools/hex-converter": "/encoding-tools/binary-converter",
  "/encoding-tools/octal-converter": "/encoding-tools/binary-converter",
  "/image-tools/base64-encoder": "/image-tools/image-to-base64",
  "/image-tools/all-in-one-image-toolkit": "/image-tools/image-compressor",
  "/image-tools/ico-generator": "/image-tools/favicon-generator",
  "/image-tools/svg-to-png": "/image-tools/image-format-converter",
  "/image-tools/passport-photo-maker": "/image-tools/image-resizer",
  "/image-tools/signature-generator": "/image-tools",
  "/pdf-tools/merge-pdf": "/pdf-tools/pdf-merger",
  "/pdf-tools/split-pdf": "/pdf-tools/pdf-splitter",
  "/pdf-tools/extract-pdf-pages": "/pdf-tools/pdf-splitter",
  "/http-tools/url-inspector": "/http-tools/url-parser",
  "/security-tools/password-strength-checker": "/security-tools/password-strength-checker",
  "/text-tools/sort-lines-za": "/text-tools/sort-lines-az",
  "/text-tools/reverse-lines": "/text-tools/sort-lines-az",
  "/text-tools/shuffle-lines": "/text-tools/sort-lines-az",
  "/text-tools/remove-line-numbers": "/text-tools/number-lines",
  "/text-tools/random-string-generator": "/trending-tools/password-generator",
  "/trending-tools/barcode-generator": "/trending-tools/qr-code-generator",
  "/trending-tools/qr-code-scanner": "/trending-tools/qr-code-generator",
  "/seo-tools/canonical-url-generator": "/developer-tools/canonical-checker",
  "/seo-tools/hreflang-generator": "/developer-tools/meta-tag-generator",
  "/developer-tools/sitemap-generator": "/seo-tools/sitemap-validator",
  "/social-media-tools/twitter-card-generator": "/seo-tools/open-graph-generator",
  "/social-media-tools/whatsapp-url-generator": "/http-tools/url-parser",
  "/image-tools/schema-markup-generator": "/developer-tools/meta-tag-generator",
  // Old URLs whose closest match is one of the tools added in the October 2026 expansion.
  "/pdf-tools/pdf-to-word": "/pdf-tools/pdf-to-text",
  "/pdf-tools/pdf-to-docx": "/pdf-tools/pdf-to-text",
  "/pdf-tools/pdf-converter": "/pdf-tools/pdf-to-text",
  "/pdf-tools/pdf-editor": "/pdf-tools/reorder-pdf-pages",
  "/javascript-tools/javascript-beautifier": "/javascript-tools/javascript-minifier",
  "/javascript-tools/javascript-formatter": "/javascript-tools/javascript-minifier",
  "/javascript-tools/javascript-obfuscator": "/javascript-tools/javascript-minifier",
  "/http-tools/http-status-checker": "/http-tools/http-header-checker",
  "/http-tools/redirect-checker": "/http-tools/http-header-checker",
  "/api-tools/http-header-viewer": "/http-tools/http-header-checker",
  "/security-tools/security-headers-checker": "/http-tools/http-header-checker",
  "/developer-tools/website-seo-audit": "/seo-tools",
  "/ai-writing-tools/meta-description-generator": "/seo-tools/meta-title-description-checker",
  "/ai-data-tools/data-summarizer": "/writing-tools/text-summarizer",
  "/ai-office-tools/executive-summary-generator": "/writing-tools/text-summarizer",
  "/ai-learning-tools/study-notes-generator": "/ai-study-tools/notes-summarizer",
  "/ai-learning-tools/flashcard-generator": "/ai-study-tools/flashcard-generator",
  "/ai-learning-tools/quiz-generator": "/ai-study-tools/quiz-generator",
  "/ai-learning-tools/explain-like-im-10": "/ai-study-tools/concept-explainer",
  "/ai-learning-tools/formula-explainer": "/ai-study-tools/concept-explainer",
  "/ai-writing-tools/email-generator": "/writing-tools/email-writer",
  "/ai-writing-tools/cover-letter-generator": "/writing-tools/email-writer",
  "/ai-office-tools/professional-email-writer": "/writing-tools/email-writer",
  "/ai-automation-tools/email-automation-drafts": "/writing-tools/email-writer",
  "/text-tools/email-rewriter": "/writing-tools/email-writer",
  "/ai-office-tools/meeting-notes-summarizer": "/writing-tools/meeting-notes-organizer",
  "/ai-office-tools/minutes-of-meeting-generator": "/writing-tools/meeting-notes-organizer",
  "/ai-office-tools/task-list-extractor": "/writing-tools/meeting-notes-organizer",
  "/ai-prompt-engineering/prompt-enhancer": "/writing-tools/prompt-builder",
  "/ai-prompt-engineering/role-prompt-generator": "/writing-tools/prompt-builder",
  "/ai-prompt-engineering/prompt-debugger": "/writing-tools/prompt-builder",
  "/ai-prompt-engineering/prompt-quality-score": "/writing-tools/prompt-builder",
  "/social-media-tools/ai-prompt-improver": "/writing-tools/prompt-builder",
  "/social-media-tools/ai-prompt-optimizer": "/writing-tools/prompt-builder",
  "/social-media-tools/gemini-prompt-generator": "/writing-tools/prompt-builder",
  "/ai-resume-career/resume-optimizer": "/writing-tools/resume-bullet-improver",
  "/ai-resume-career/ats-resume-checker": "/writing-tools/resume-bullet-improver",
  "/social-media-tools/ai-resume-score": "/writing-tools/resume-bullet-improver",
  "/social-media-tools/ai-resume-builder": "/writing-tools/resume-bullet-improver",
  "/ai-marketing-tools/thumbnail-text-generator": "/creator-tools/youtube-thumbnail-maker",
  "/ai-marketing-tools/youtube-title-generator": "/creator-tools/youtube-title-description-helper",
  "/social-media-tools/youtube-tags-generator": "/creator-tools/youtube-title-description-helper",
  "/social-media-tools/ai-instagram-caption-generator": "/creator-tools/hashtag-organizer",
  "/trending-tools/study-planner": "/student-tools/study-hours-planner",
};

// Fallback by first path segment -> hub.
const HUB_BY_SEGMENT = {
  calculators: "/everyday-calculators",
  "business-tools": "/finance-calculators",
  "business-finance": "/finance-calculators",
  "banking-tools": "/finance-calculators",
  "loan-calculators": "/finance-calculators",
  "mutual-fund-tools": "/finance-calculators",
  "retirement-tools": "/finance-calculators",
  "insurance-tools": "/finance-calculators",
  "tax-tools": "/tax-salary-tools",
  "salary-hr": "/tax-salary-tools",
  "json-tools": "/developer-tools",
  "html-tools": "/developer-tools",
  "javascript-tools": "/developer-tools",
  "api-tools": "/developer-tools",
  "developer-tools": "/developer-tools",
  "ai-coding-tools": "/developer-tools",
  "ai-dev-tools": "/developer-tools",
  "ai-data-tools": "/developer-tools",
  "css-tools": "/seo-design-tools",
  "seo-tools": "/seo-tools",
  "ai-seo-tools": "/seo-tools",
  "social-media-tools": "/creator-tools",
  "ai-marketing-tools": "/creator-tools",
  "ai-office-tools": "/writing-tools",
  "ai-resume-career": "/writing-tools",
  "ai-prompt-engineering": "/writing-tools",
  "ai-learning-tools": "/ai-study-tools",
  "encoding-tools": "/encoding-tools",
  "hash-tools": "/encoding-tools",
  "security-tools": "/encoding-tools",
  "http-tools": "/encoding-tools",
  "jwt-tools": "/developer-tools",
  "image-tools": "/image-tools",
  "ai-image-helpers": "/image-tools",
  "pdf-tools": "/pdf-tools",
  "text-tools": "/text-tools",
  "ai-writing-tools": "/writing-tools",
};

function target(path) {
  if (CLOSEST[path]) return CLOSEST[path];
  const seg = path.split("/")[1];
  return HUB_BY_SEGMENT[seg] || "/tools";
}

/** @type {Record<string,string>} old path -> new path (all 301) */
export const REDIRECTS = Object.fromEntries(
  LEGACY_PATHS.filter((p) => !kept.has(p))
    .map((p) => [p, target(p)])
    .filter(([from, to]) => from !== to)
);

// Old non-tool aliases that the React router handled.
Object.assign(REDIRECTS, {
  "/Contact": "/contact",
  "/privacy": "/privacy-policy",
  "/terms-and-conditions": "/terms",
  "/cookies": "/cookie-policy",
});

// Old-site URLs that were in its sitemaps (backup of 17 Oct 2026) but were not tool routes, so the
// rebuild returned 404 for them (Search Console: "Not found (404)").
Object.assign(REDIRECTS, {
  // Old category hub pages
  "/calculators": "/everyday-calculators",
  "/business-tools": "/finance-calculators",
  "/social-media-tools": "/creator-tools",
  "/trending-tools": "/tools",
  "/ai-learning-tools": "/ai-study-tools",
  "/suggestion": "/contact",
  // Old tools missing from legacy-paths.js
  "/social-media-tools/instagram-video-downloader": "/creator-tools",
  "/social-media-tools/youtube-thumbnail-downloader": "/creator-tools",
});

// Retired files (not pages). Only written to the host redirect files, never as Astro HTML pages.
export const FILE_REDIRECTS = {
  "/sitemap-apex.xml": "/sitemap.xml",
  "/manifest.webmanifest": "/site.webmanifest",
};

// The old blog and its blog tools were deleted on purpose. These answer 410 Gone (not 404) so search
// engines drop them from the index quickly. Nothing on the site links to them.
export const GONE = {
  host: "blog.freetoolspro.in", // the whole old blog subdomain
  prefixes: ["/blog/", "/images/blog/"], // /blog/<anything> and the old blog images
  exact: ["/blog", "/sitemap-blog.xml", "/sitemap-images.xml", "/ai-writing-tools/blog-outline-generator", "/social-media-tools/blog-title-generator"],
};

// Astro writes one HTML file per redirect. Skip any whose name differs from a real page only by
// letter case (it would overwrite that page on Windows and macOS file systems).
const realPaths = new Set([...kept, "/contact", "/about", "/tools", "/privacy-policy", "/terms", "/disclaimer", "/cookie-policy"].map((p) => p.toLowerCase()));
export const ASTRO_REDIRECTS = Object.fromEntries(Object.entries(REDIRECTS).filter(([from]) => !realPaths.has(from.toLowerCase())));

// Programmatic SEO variant pages (/<tool>/:variant) collapse into their parent tool.
// These need wildcard support from the host; see scripts/write-redirects.mjs.
export const WILDCARD_REDIRECTS = [
  "/image-tools/image-format-converter",
  "/image-tools/image-compressor",
  "/image-tools/image-to-base64",
  "/encoding-tools/base64-decode",
  "/encoding-tools/base64-encode",
  "/trending-tools/unit-converter",
  "/banking-tools/simple-interest-calculator",
  "/banking-tools/compound-interest-calculator",
  "/calculators/emi-calculator",
  "/calculators/bmi-calculator",
  "/calculators/sip-calculator",
  "/calculators/inflation-calculator",
  "/calculators/loan-eligibility-calculator",
  "/business-tools/gst-calculator",
].map((p) => [`${p}/*`, p]);
