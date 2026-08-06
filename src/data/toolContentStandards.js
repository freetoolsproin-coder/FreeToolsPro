import { SITE_NAME } from "./siteConstants";

/** Sitewide editorial review stamp — update when tool copy or behavior is audited. */
export const TOOL_CONTENT_LAST_REVIEWED = "2026-08-02";

export function formatLastReviewed(isoDate = TOOL_CONTENT_LAST_REVIEWED) {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const CATEGORY_PRIVACY = {
  calculators:
    "Calculator inputs (amounts, dates, height, weight, and similar fields) are processed in your browser for the live result. FreeToolsPro does not upload those values for standard calculator use. Avoid sharing screenshots that contain sensitive financial or health data.",
  "text-tools":
    "Text you paste into text tools is transformed in your browser when possible. Drafts are not stored on FreeToolsPro servers for the core transform. Do not paste passwords, API keys, or confidential documents on shared screens.",
  "developer-tools":
    "Developer utilities typically run locally in your browser. Code, JSON, and API samples you paste are not saved on FreeToolsPro unless a feature explicitly calls an external service (for example SEO checks or AI helpers).",
  "image-tools":
    "Image files you select are processed in your browser for resize, convert, and metadata tools. Images are not uploaded to FreeToolsPro for standard local processing. Network-backed AI image features may send prompts or images to a provider—see the tool UI before use.",
  "pdf-tools":
    "PDF merge, split, and edit tools process files in your browser. Documents are not uploaded to FreeToolsPro for standard local PDF work. Clear downloads you no longer need from your device.",
  "business-tools":
    "Business form inputs (invoice lines, GST figures, payroll fields) stay in your browser for standard generators. Export PDFs or copies only to destinations you trust.",
  "social-media-tools":
    "Captions, bios, and prompts you enter are used to generate on-page suggestions. AI-backed social tools may send text to a model provider. Do not paste private customer data into experimental generators.",
  "trending-tools":
    "Trending utilities follow the same browser-first model when possible. Tools that need live data (weather, currency, AQI) make network requests with the parameters you enter—no account is required for standard use.",
  "ai-tools":
    "AI tools send the text or prompt you provide to generate a response. Do not submit secrets, personal identifiers, or regulated data. Outputs are suggestions—review before publishing.",
  "ai-writing-tools":
    "AI writing tools send your topic or draft to generate suggestions. Content is not stored as a profile on FreeToolsPro, but provider policies may apply. Edit outputs before publishing.",
  "finance-tools":
    "Finance inputs are calculated in your browser for standard tools. Figures are estimates for planning—not official bank, tax, or investment advice.",
  "banking-tools":
    "Banking calculators process deposit, loan, and interest inputs locally. Results are illustrative; confirm rates and terms with your bank.",
};

const CATEGORY_LIMITATIONS = {
  calculators: [
    "Results are educational estimates, not medical, legal, or lending advice.",
    "Formulas and tax or health ranges can differ by country, lender, or clinician.",
    "Extreme inputs (zero tenure, negative amounts) may produce invalid or misleading output.",
  ],
  "text-tools": [
    "Very large pastes can slow older devices; work in chunks if the page feels sluggish.",
    "Transforms may not preserve every Unicode edge case or proprietary formatting.",
    "AI rewrites can change meaning—always proofread before sending.",
  ],
  "developer-tools": [
    "SEO, speed, and traffic checks depend on third-party endpoints and may rate-limit.",
    "Formatted output should be reviewed before production deploys.",
    "Regex and SQL helpers do not replace security review of user-supplied data.",
  ],
  "image-tools": [
    "Heavy images may hit browser memory limits on low-end phones.",
    "Color and compression results vary by source file and display profile.",
    "AI-generated images may not be unique or rights-cleared for commercial use.",
  ],
  "pdf-tools": [
    "Scanned PDFs need OCR elsewhere before text tools can edit content.",
    "Complex layouts, forms, and encryption may not be fully supported.",
    "Large files can take longer to process entirely in the browser.",
  ],
  "business-tools": [
    "Generated invoices and receipts are templates—you must verify tax IDs and legal wording.",
    "Currency and GST rules change; confirm with your accountant.",
  ],
  "social-media-tools": [
    "AI captions and titles may sound generic—edit for brand voice.",
    "Platform character limits and policies change; verify before posting.",
  ],
  "trending-tools": [
    "Live data tools depend on external APIs that can be delayed or unavailable.",
    "Sample or cached data may appear when a live feed fails.",
  ],
  "ai-tools": [
    "AI output can be inaccurate, biased, or outdated.",
    "Not suitable for regulated, medical, or legal decisions without human review.",
  ],
  "ai-writing-tools": [
    "Generated copy may need fact-checking and plagiarism review.",
    "Tone and length controls are approximate, not guaranteed.",
  ],
  "finance-tools": [
    "Interest rates, tax slabs, and fees from real institutions may differ.",
    "Projections assume constant rates unless the tool states otherwise.",
  ],
  "banking-tools": [
    "Compounding frequency and day-count conventions vary by bank.",
    "TDS, penalties, and prepayment rules are not modeled in every calculator.",
  ],
};

const DEFAULT_PRIVACY =
  `${SITE_NAME} tools are designed to run in your browser when possible. Inputs are not uploaded for standard local processing. Analytics, ads, and contact forms are described in our Privacy Policy and Cookie Policy.`;

const DEFAULT_LIMITATIONS = [
  "Outputs are practical helpers—not official advice for finance, health, legal, or production systems.",
  "Edge cases (empty input, extreme values, unusual formats) should be verified manually.",
  "Network-backed features depend on third-party availability and may change without notice.",
];

export function getDefaultPrivacyStatement(category, toolName) {
  const base = CATEGORY_PRIVACY[category] || DEFAULT_PRIVACY;
  if (!toolName) return base;
  return `${base} This page describes how ${toolName} fits that model.`;
}

export function getDefaultLimitations(category, toolName, extra = []) {
  const base = CATEGORY_LIMITATIONS[category] || DEFAULT_LIMITATIONS;
  const merged = [...extra, ...base];
  if (toolName) {
    merged.push(`Always sanity-check ${toolName} output against your source data before relying on it.`);
  }
  return merged.filter((item, i, arr) => arr.indexOf(item) === i).slice(0, 6);
}

export function getDefaultExamplePair(category, toolName, catExamples = []) {
  if (catExamples.length >= 2) {
    return [
      {
        input: `Sample input for ${toolName}`,
        result: catExamples[0],
        note: catExamples[1],
      },
    ];
  }
  if (catExamples.length === 1) {
    return [
      {
        input: `Enter realistic values in the ${toolName} form above.`,
        result: catExamples[0],
      },
    ];
  }

  const fallbacks = {
    calculators: {
      input: "Principal: ₹10,00,000 · Rate: 8.5% p.a. · Tenure: 20 years",
      result: "Approx. EMI ₹8,678 · Total interest ₹10,82,720 (illustrative)",
    },
    "text-tools": {
      input: "  apple\nbanana\n  apple\n",
      result: "Sorted, trimmed list:\napple\nbanana",
    },
    "developer-tools": {
      input: '{"name":"Ada","active":true}',
      result: "Formatted JSON with indentation and validated syntax",
    },
    "image-tools": {
      input: "photo.jpg (2.4 MB PNG)",
      result: "Compressed JPEG ~420 KB at 80% quality (download ready)",
    },
    "pdf-tools": {
      input: "two-page-sample.pdf",
      result: "Merged single PDF or extracted page 1 as a new file",
    },
  };

  const pair = fallbacks[category] || {
    input: `Paste or enter a small realistic sample in ${toolName}.`,
    result: "Live output appears above—copy or download when it matches your goal.",
  };

  return [{ input: pair.input, result: pair.result }];
}
