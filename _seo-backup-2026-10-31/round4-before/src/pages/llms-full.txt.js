import { SITE } from "../data/site.js";
import { CATEGORIES, toolsIn } from "../data/catalog.js";
import { ABOUT, HOME_FAQS } from "../data/home.js";
import { stepsFor } from "../components/static/ToolPage.jsx";

// The whole catalogue as plain text: what each tool does, how to use it, and its FAQs.
export const GET = () => {
  const parts = [`# ${SITE.name}: full catalogue`, "", `> ${ABOUT}`, "", `Last reviewed: ${SITE.updated}`, "", "## About the site", ""];
  for (const [q, a] of HOME_FAQS) parts.push(`Q: ${q}`, `A: ${a}`, "");
  for (const c of CATEGORIES) {
    parts.push(`## ${c.name}`, "", c.intro, `Hub: ${SITE.url}${c.path}`, "");
    for (const t of toolsIn(c.id)) {
      parts.push(`### ${t.name}`, "", `URL: ${SITE.url}${t.path}`, "", t.description, "", t.intro, "", "How to use it:");
      stepsFor(t).forEach((s, i) => parts.push(`${i + 1}. ${s}`));
      parts.push("");
      for (const [q, a] of t.faqs) parts.push(`Q: ${q}`, `A: ${a}`, "");
    }
  }
  return new Response(parts.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
