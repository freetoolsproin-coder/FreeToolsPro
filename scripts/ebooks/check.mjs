// Editorial check. A book that fails any rule stops the build.
import { unencodable } from "./render.mjs";

export const RULES = {
  pages: 90,
  scenarios: 15,
  problems: 25,
  faqs: 50,
  glossary: 25,
  references: 6,
  perLevel: 5,
};

// Figures that were true once and are not any more. A book that still says
// one of these fails. Keep the list in step with the tools.
const STALE = [
  [/four metros/i, "HRA 50% now covers eight cities"],
  [/Delhi, Mumbai, Kolkata (?:or|and) Chennai(?!, Bengaluru)/, "HRA 50% list is eight cities"],
  [/(?:EPS|pension scheme)[^.]*1,250|1,250[^.]*(?:EPS|pension scheme)/i, "EPS cap now follows the Rs. 25,000 ceiling"],
  [/wage ceiling of (?:Rs\. ?|₹)15,000/i, "EPF wage ceiling is Rs. 25,000 from 17 Sep 2026"],
  [/at least 40 percent[^.]*annuity/i, "non-government NPS annuity minimum is 20%", /government (?:employee|subscriber)/i],
  [/gratuity[^.]*(?<![\d.])25 lakh|(?<![\d.])25 lakh[^.]*gratuity/i, "gratuity tax-free limit is Rs. 20 lakh"],
  [/\bTODO\b|\bTKTK\b|lorem ipsum/i, "placeholder text"],
  [/\bNaN\b|\bInfinity\b|\bundefined\b|\[object Object\]/, "a computed value failed"],
];

function walk(chapters, fn) {
  const visit = (b) => {
    for (const k of ["title", "heading", "label", "note", "code", "codeCaption", "kicker"]) if (b[k]) fn(String(b[k]), k);
    for (const k of ["paragraphs", "bullets", "steps", "after"]) for (const p of b[k] || []) fn(String(p), k);
    for (const t of [b.table, ...(b.tables || [])].filter(Boolean)) {
      if (t.caption) fn(t.caption, "caption");
      for (const r of [t.headers, ...t.rows]) for (const c of r) fn(String(c), "cell");
    }
    for (const c of b.codes || []) fn(String(c.code), "code");
    for (const s of b.sections || []) visit(s);
  };
  chapters.forEach(visit);
}

export function checkBook({ slug, chapters, counts, material, pages, overflows }) {
  const problems = [];
  const need = (ok, msg) => ok || problems.push(msg);
  need(pages >= RULES.pages, `${pages} pages, needs ${RULES.pages}`);
  need(counts.scenarios >= RULES.scenarios, `${counts.scenarios} situations, needs ${RULES.scenarios}`);
  need(counts.problems >= RULES.problems, `${counts.problems} worked problems, needs ${RULES.problems}`);
  need(counts.faqs >= RULES.faqs, `${counts.faqs} FAQs, needs ${RULES.faqs}`);
  need(counts.glossary >= RULES.glossary, `${counts.glossary} glossary terms, needs ${RULES.glossary}`);
  need(counts.references >= RULES.references, `${counts.references} references, needs ${RULES.references}`);
  for (const [k, n] of Object.entries(counts.exercises)) need(n >= RULES.perLevel, `${n} ${k} exercises, needs ${RULES.perLevel}`);
  for (const lvl of Object.values(material.exercises)) for (const e of lvl) need(e.a && String(e.a).length > 0, `exercise without an answer: ${String(e.q).slice(0, 50)}`);
  for (const p of material.problems) need(p.answer && (p.work?.length || p.steps?.length), `problem without working or answer: ${p.title}`);
  for (const g of material.faqs) for (const [q, a] of g.items) need(String(a).split(/\s+/).length >= 18, `FAQ answer too thin: ${q}`);
  for (const s of material.scenarios) {
    const words = [...(s.paragraphs || []), ...(s.bullets || []), ...(s.steps || []), ...(s.after || [])].join(" ").split(/\s+/).length;
    need(words >= 110, `situation too short (${words} words): ${s.title}`);
  }
  for (const r of material.references) need(r.who && r.note, `reference missing publisher or note: ${r.title}`);

  const seen = new Map();
  walk(chapters, (text, kind) => {
    const bad = unencodable(text);
    if (bad.length) problems.push(`characters the PDF font cannot draw (${bad.join(" ")}) in: ${text.slice(0, 50)}`);
    for (const [re, why, unless] of STALE) if (re.test(text) && !(unless && unless.test(text))) problems.push(`stale figure (${why}): ${text.slice(0, 80)}`);
    if (kind === "paragraphs" && text.length > 60) {
      if (seen.has(text)) problems.push(`repeated paragraph: ${text.slice(0, 60)}`);
      seen.set(text, true);
    }
  });
  for (const o of overflows) problems.push(`text past the right margin on page ${o.page} by ${o.over}pt: ${o.text}`);
  return { slug, ok: problems.length === 0, problems };
}
