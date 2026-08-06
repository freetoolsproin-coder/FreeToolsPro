import { getCategoryHowTo } from "./categoryHowTo";
import { getToolWhatItDoes } from "./toolWhatItDoes";
import { SITE_NAME } from "./siteConstants";
import {
  TOOL_CONTENT_LAST_REVIEWED,
  formatLastReviewed,
  getDefaultExamplePair,
  getDefaultLimitations,
  getDefaultPrivacyStatement,
} from "./toolContentStandards";
import { getToolExamplePairs } from "./toolExamplePairs";

function flattenWhatItDoes(content) {
  if (!content) return { paragraphs: [], sectionMap: {} };
  const paragraphs = [...(content.paragraphs || [])];
  const sectionMap = {};
  for (const section of content.sections || []) {
    sectionMap[section.title.toLowerCase()] = section.paragraphs || [];
    paragraphs.push(...(section.paragraphs || []));
  }
  return { paragraphs, sectionMap };
}

function findSection(sectionMap, ...keys) {
  for (const key of keys) {
    for (const [title, paras] of Object.entries(sectionMap)) {
      if (title.includes(key)) return paras;
    }
  }
  return [];
}

function normalizeExamplePairs(pairs) {
  if (!pairs?.length) return [];
  return pairs
    .map((pair) => {
      if (!pair) return null;
      if (typeof pair === "string") {
        return { input: "Sample input", result: pair };
      }
      const input = pair.input ?? pair.exampleInput ?? "";
      const result = pair.result ?? pair.output ?? pair.exampleOutput ?? "";
      if (!input && !result) return null;
      return {
        input: String(input),
        result: String(result),
        note: pair.note ? String(pair.note) : undefined,
      };
    })
    .filter(Boolean);
}

/**
 * Builds editorial copy for the standard 8-section tool page:
 * what it does, how to use, examples, privacy, limitations, FAQs, related, last reviewed.
 */
export function buildToolPageCopy({
  tool,
  category,
  currentToolPath,
  howTitle,
  howBody,
  steps,
  faqs,
  whatItDoes,
  examplePairs,
  privacyStatement,
  limitations,
  lastReviewed,
}) {
  const name = tool?.name || "This tool";
  const desc = tool?.desc || `${name} helps you finish a focused task in your browser.`;
  const cat = getCategoryHowTo(category) || {};
  const resolvedWhat = whatItDoes ?? getToolWhatItDoes(currentToolPath);
  const { paragraphs: whatParas, sectionMap } = flattenWhatItDoes(resolvedWhat);

  const limitParas = findSection(sectionMap, "limit", "when not", "drawback");
  const privacyParas = findSection(sectionMap, "privacy", "data", "storage");

  const whatItDoesSummary = [
    howBody ||
      `${name} is a free online utility on ${SITE_NAME}: ${desc.charAt(0).toLowerCase()}${desc.slice(1)}`,
    ...(whatParas.slice(0, 2).length
      ? whatParas.slice(0, 2)
      : [
          `${name} focuses on one job in the browser so you can finish the task above, then copy or download the result without installing desktop software.`,
        ]),
  ].filter(Boolean);

  const resolvedSteps =
    steps?.length > 0
      ? steps
      : cat.steps || [
          {
            title: "Open the workspace",
            body: `Use the ${name} form above—no install required.`,
          },
          {
            title: "Enter realistic inputs",
            body: "Results update as you edit. Prefer complete samples over placeholders.",
          },
          {
            title: "Review the output",
            body: "Check units, formatting, and edge cases before you copy or download.",
          },
          {
            title: "Save what you need",
            body: "Copy the result into your workflow, then try a related tool if the next step differs.",
          },
        ];

  const explicitExamples = normalizeExamplePairs(examplePairs);
  const registryExamples = normalizeExamplePairs(getToolExamplePairs(currentToolPath));
  const categoryExamples = normalizeExamplePairs(cat.examplePairs);

  const resolvedExamplePairs =
    explicitExamples.length > 0
      ? explicitExamples
      : registryExamples.length > 0
        ? registryExamples
        : categoryExamples.length > 0
          ? categoryExamples
          : getDefaultExamplePair(category, name, cat.examples || []);

  const resolvedPrivacy =
    privacyStatement ||
    privacyParas[0] ||
    cat.privacyNote ||
    getDefaultPrivacyStatement(category, name);

  const resolvedLimitations =
    limitations?.length > 0
      ? limitations
      : getDefaultLimitations(category, name, limitParas.slice(0, 2));

  const faqList = mergeFaqs(faqs, cat.faqs, name);

  return {
    whatTitle: `What ${name} does`,
    howTitle: howTitle || cat.howTitle || `How to use ${name}`,
    whatItDoesSummary,
    steps: resolvedSteps,
    examplePairs: resolvedExamplePairs,
    privacyStatement: resolvedPrivacy,
    limitations: resolvedLimitations,
    faqs: faqList,
    trustBullets: cat.trustBullets,
    whatItDoes: resolvedWhat,
    lastReviewed: lastReviewed || TOOL_CONTENT_LAST_REVIEWED,
    lastReviewedLabel: formatLastReviewed(lastReviewed || TOOL_CONTENT_LAST_REVIEWED),
  };
}

function mergeFaqs(toolFaqs, categoryFaqs, name) {
  const list = [];
  const seen = new Set();
  const push = (item) => {
    if (!item?.q || seen.has(item.q)) return;
    seen.add(item.q);
    list.push(item);
  };

  (toolFaqs || []).forEach(push);
  (categoryFaqs || []).forEach(push);

  if (list.length < 4) {
    [
      {
        q: `Is ${name} free on FreeToolsPro?`,
        a: `Yes. ${name} is free for standard use—no account is required to open the tool and get a result.`,
      },
      {
        q: `Do I need to install software to use ${name}?`,
        a: "No. FreeToolsPro tools run in your browser on phone or desktop.",
      },
      {
        q: `Are results from ${name} official advice?`,
        a: "No. Outputs are practical estimates or transforms based on your inputs. Verify critical finance, health, legal, or production decisions with an appropriate professional or system.",
      },
    ].forEach(push);
  }

  if (list.length < 5) {
    push({
      q: "How does FreeToolsPro handle privacy?",
      a: "Many tools process inputs in the browser. See the Privacy Policy and Cookie Policy for analytics, AdSense, and contact-form details.",
    });
  }

  return list.slice(0, 8);
}
