import { getCategoryHowTo } from "./categoryHowTo";
import { getToolWhatItDoes } from "./toolWhatItDoes";
import { SITE_NAME } from "./siteConstants";

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

/**
 * Builds editorial copy aligned with Google-preferred tool-page sections:
 * what it does, why use it, how to use, examples, use cases, tips, FAQs.
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
}) {
  const name = tool?.name || "This tool";
  const desc = tool?.desc || `${name} helps you finish a focused task in your browser.`;
  const cat = getCategoryHowTo(category) || {};
  const resolvedWhat = whatItDoes ?? getToolWhatItDoes(currentToolPath);
  const { paragraphs: whatParas, sectionMap } = flattenWhatItDoes(resolvedWhat);

  const exampleParas = findSection(sectionMap, "example");
  const tipParas = findSection(
    sectionMap,
    "tip",
    "better result",
    "best practice",
    "good practice"
  );
  const limitParas = findSection(sectionMap, "limit", "when not", "privacy");
  const whoParas = findSection(sectionMap, "who", "use case", "practical", "when to use");

  // What the tool does — lead with tool-specific explanation, not filler.
  const whatItDoesSummary = [
    howBody ||
      `${name} is a free online utility on ${SITE_NAME}: ${desc.charAt(0).toLowerCase()}${desc.slice(1)}`,
    ...(whatParas.slice(0, 2).length
      ? whatParas.slice(0, 2)
      : [
          `${name} focuses on one job in the browser so you can finish the task above, then copy or download the result without installing desktop software.`,
        ]),
  ].filter(Boolean);

  const whyUseful = [
    desc,
    ...(whoParas.length ? whoParas.slice(0, 2) : []),
    cat.whyBody ||
      `People open ${name} when they need a quick, transparent answer they can verify before taking the next step in email, code, docs, or spreadsheets.`,
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

  const benefits = cat.benefits || [
    `Free access to ${name} without a signup wall for standard use`,
    "Works in modern desktop and mobile browsers",
    "On-page instructions, examples, tips, and FAQs",
    "Related FreeToolsPro utilities for the next step in your workflow",
  ];

  const useCases = cat.useCases || [
    ...(whoParas.length
      ? whoParas.slice(0, 2)
      : [
          `Everyday ${category?.replace(/-/g, " ") || "utility"} tasks where a quick, clear result matters more than a heavyweight app`,
        ]),
    `Drafting or checking work with ${name} before you paste it into email, docs, or production systems`,
    `Teaching or explaining a concept using ${name} as a live demo`,
  ];

  const examples = exampleParas.length
    ? exampleParas
    : cat.examples || [
        `Open ${name}, enter a small realistic sample that matches your goal, and compare the live output with what you expected.`,
        `If the first pass looks off, change one option at a time so you can see which control changed the result.`,
      ];

  const tips = [
    ...(cat.tips || []),
    ...tipParas.slice(0, 2),
    limitParas[0] ||
      `Double-check edge cases (empty input, extreme values, odd formatting) before you rely on ${name} for an important decision.`,
    `Keep an original copy of your data until you confirm the transform or calculation matches what you need.`,
  ]
    .filter(Boolean)
    // de-dupe near-identical tips
    .filter((tip, i, arr) => arr.findIndex((t) => t.slice(0, 48) === tip.slice(0, 48)) === i)
    .slice(0, 5);

  const faqList = mergeFaqs(faqs, cat.faqs, name);

  return {
    whatTitle: `What ${name} does`,
    howTitle: howTitle || cat.howTitle || `How to use ${name}`,
    whatItDoesSummary,
    whyUseful,
    steps: resolvedSteps,
    examples,
    benefits,
    useCases,
    tips,
    faqs: faqList,
    privacyNote: cat.privacyNote,
    trustBullets: cat.trustBullets,
    whatItDoes: resolvedWhat,
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

  // Only add sitewide FAQs when the page is still thin—avoid identical FAQ blocks on every URL.
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
