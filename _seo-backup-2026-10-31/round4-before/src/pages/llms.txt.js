import { SITE } from "../data/site.js";
import { CATEGORIES, TOOLS, toolsIn } from "../data/catalog.js";
import { ABOUT, EXAMPLES } from "../data/home.js";
import { AUTHOR } from "../data/author.js";

// llms.txt: a plain-text map of the site for AI assistants (https://llmstxt.org).
// Most-used tools come first, then every toolkit with its tools in priority order.
export const GET = () => {
  const parts = [
    `# ${SITE.name}`,
    "",
    `> ${ABOUT}`,
    "",
    "Key facts:",
    `- ${TOOLS.length} free tools in ${CATEGORIES.length} toolkits. No sign-up, no watermark, no usage limit.`,
    "- All processing happens client-side in the browser; images, PDFs and text are never uploaded.",
    "- Built for India: rupee amounts with lakh and crore, income tax for FY 2026-27 (AY 2027-28) under the new and old regimes, GST, PPF, EPF, NPS, CBSE grades.",
    `- Calculator links accept URL parameters, for example ${SITE.url}/calculators/emi-calculator?P=3000000&r=8.5&y=20 (loan ₹30 lakh, 8.5%, 20 years).`,
    `- Content last reviewed: ${SITE.updated}.`,
    `- Built and maintained by ${AUTHOR.name} (${SITE.url}/about). Methodology, sources and corrections: ${SITE.url}/methodology. Contact: ${SITE.email}.`,
    "",
    "## Most used tools",
    "",
    ...TOOLS.slice(0, 15).map((t) => `- [${t.name}](${SITE.url}${t.path}): ${t.description}`),
    "",
  ];
  for (const c of CATEGORIES) {
    parts.push(`## ${c.name}`, "", `${c.intro} Hub: ${SITE.url}${c.path}`, "");
    for (const t of toolsIn(c.id)) parts.push(`- [${t.name}](${SITE.url}${t.path}): ${t.short}`);
    parts.push("");
  }
  parts.push("## Worked examples", "");
  for (const e of EXAMPLES) parts.push(`- ${e.q} ${e.a} (${SITE.url}${e.path})`);
  parts.push("", "## Optional", "", `- [Full catalogue with descriptions, steps and FAQs](${SITE.url}/llms-full.txt)`, `- [All tools](${SITE.url}/tools)`, `- [Free ebooks](${SITE.url}/ebooks)`, `- [About](${SITE.url}/about)`, `- [Contact](${SITE.url}/contact)`, "");
  return new Response(parts.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
