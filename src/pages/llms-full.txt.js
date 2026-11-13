import { SITE } from "../data/site.js";
import { CATEGORIES, toolsIn } from "../data/catalog.js";
import { ABOUT, HOME_FAQS } from "../data/home.js";
import { stepsFor, qaFor } from "../components/static/ToolPage.jsx";
import { DEPTH, ENGINE_LIMITS } from "../data/tool-depth.js";
import { HUB_CONTENT, plainText } from "../data/hub-content.js";
import { answerFor } from "../lib/worked-example.js";

// The whole catalogue as plain text: what each tool does, how to use it, and its FAQs.
export const GET = () => {
  const parts = [`# ${SITE.name}: full catalogue`, "", `> ${ABOUT}`, "", `Last reviewed: ${SITE.updated}`, `Maintained by: the ${SITE.name} team (${SITE.url}/about)`, `Methodology, sources and corrections: ${SITE.url}/methodology`, "", "## About the site", ""];
  for (const [q, a] of HOME_FAQS) parts.push(`Q: ${q}`, `A: ${a}`, "");
  for (const c of CATEGORIES) {
    parts.push(`## ${c.name}`, "", c.intro, `Hub: ${SITE.url}${c.path}`, "");
    const h = HUB_CONTENT[c.id];
    if (h) {
      for (const a of h.answers || []) parts.push(`Q: ${a.q}`, `A: ${answerFor(a).text}`, "");
      for (const [q, a] of h.faqs) parts.push(`Q: ${q}`, `A: ${plainText(a)}`, "");
    }
    for (const t of toolsIn(c.id)) {
      parts.push(`### ${t.name}`, "", `URL: ${SITE.url}${t.path}`, "", t.description, "", t.intro, "", "How to use it:");
      stepsFor(t).forEach((s, i) => parts.push(`${i + 1}. ${s}`));
      parts.push("");
      const d = DEPTH[t.id];
      if (d?.how) parts.push(t.engine === "calc" ? "How it's calculated:" : "How it works:", d.how, ...(d.formula ? [`Formula: ${d.formula}`] : []), "");
      const qa = t.engine === "calc" ? qaFor(t) : null;
      if (qa) parts.push(`Worked example. Q: ${qa.q}`, `A: ${qa.a}`, "");
      const limits = [...(d?.limits || []), ...(ENGINE_LIMITS[t.engine] || [])];
      if (limits.length) parts.push("Limitations:", ...limits.map((l) => `- ${l}`), "");
      if (d?.src?.length) parts.push("Sources:", ...d.src.map(([l, u]) => `- ${l}: ${u}`), "");
      for (const [q, a] of t.faqs) parts.push(`Q: ${q}`, `A: ${a}`, "");
    }
  }
  return new Response(parts.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
