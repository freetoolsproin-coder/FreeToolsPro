// SEO / AEO / GenAI-search refresh, driven by real Search Console data.
//
// 1. Reads the last 28 days of Search Console data (API, or a CSV export of the Pages report).
// 2. Picks the tool pages that are underperforming: plenty of impressions but a click-through rate
//    below what their position should earn, or stuck on positions 4–20.
// 3. For each one (at most --limit), asks AI for a new title, meta description, a quick answer
//    (question + 40–80 word answer shown at the top of the page and first in the FAQPage JSON-LD,
//    which is what answer engines and AI search quote) and 2–3 extra FAQs aimed at the real queries.
// 4. Checks every proposal (lengths, duplicates, format) and writes a report to automation/reports/.
//    With --apply it also writes them to src/data/seo-overrides.js, which the site reads at build time.
// 5. Also reports how pages changed in earlier runs have done since (CTR and position before vs now).
//
//   npm run seo:refresh                     proposals + report only (nothing on the site changes)
//   npm run seo:refresh -- --apply          write the proposals to seo-overrides.js
//   npm run seo:refresh -- --csv Pages.csv  use a Search Console export instead of the API
//   npm run seo:refresh -- --ids emi-calculator,sip-calculator   refresh these tools (no data needed)
//   npm run seo:revert -- emi-calculator    put a page back to what it had before its last refresh
//
// Settings in .env: GSC_KEY_FILE, GSC_SITE, SEO_LIMIT, SEO_MIN_IMPRESSIONS, SEO_COOLDOWN_DAYS,
// LLM_PROVIDER and its key. Pages changed in the last SEO_COOLDOWN_DAYS days are left alone,
// because Google needs a few weeks to show whether a change worked.
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";
import { join, resolve } from "node:path";
import { TOOLS, toolById, toolByPath, categoryById } from "../../src/data/catalog.js";
import { SITE } from "../../src/data/site.js";
import { DEPTH } from "../../src/data/tool-depth.js";
import OVERRIDES from "../../src/data/seo-overrides.js";
import { ROOT, REPORT_DIR, env, flag, option, args, writeText, today, daysAgo } from "./lib/env.mjs";
import { askJson, llmConfig } from "./lib/llm.mjs";

const OVERRIDES_FILE = join(ROOT, "src", "data", "seo-overrides.js");
const LIMIT = Number(option("limit", env("SEO_LIMIT", "5")));
const MIN_IMPR = Number(option("min-impressions", env("SEO_MIN_IMPRESSIONS", "50")));
const COOLDOWN = Number(option("cooldown", env("SEO_COOLDOWN_DAYS", "45")));
const APPLY = flag("apply");
// Search Console data lags 2–3 days; use the 28 days that end 3 days ago.
const RANGE = { startDate: daysAgo(31), endDate: daysAgo(3) };

// ---------------------------------------------------------------- overrides file

function saveOverrides(data) {
  const text = readFileSync(OVERRIDES_FILE, "utf8");
  const header = text.slice(0, text.indexOf("export default"));
  const sorted = Object.fromEntries(Object.keys(data).sort().map((k) => [k, data[k]]));
  writeText(OVERRIDES_FILE, `${header}export default ${JSON.stringify(sorted, null, 2)};\n`);
}

function revert(id) {
  const o = OVERRIDES[id];
  if (!o) return console.log(`${id} has no SEO override; it already uses the hand-written copy in src/data/tools/.`);
  const next = { ...OVERRIDES };
  const prev = o.history?.at(-1);
  if (prev) next[id] = { ...prev, history: o.history.slice(0, -1) };
  else delete next[id];
  saveOverrides(next);
  console.log(`${id}: reverted to ${prev ? `the version from ${prev.updated}` : "the hand-written copy"}. Build and deploy to publish it.`);
}

// ---------------------------------------------------------------- Search Console

async function gscToken(keyFile) {
  const key = JSON.parse(readFileSync(keyFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: key.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(key.private_key).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(`Google sign-in failed: ${j.error_description || j.error || r.status}`);
  return j.access_token;
}

async function gscQuery(token, site, body) {
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ ...RANGE, ...body }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Search Console ${r.status}: ${j.error?.message || JSON.stringify(j)}`);
  return j.rows || [];
}

const pathOf = (u) => {
  try {
    const p = new URL(u).pathname.replace(/\/+$/, "");
    return p || "/";
  } catch {
    return null;
  }
};

/** Search Console "Pages" export: Top pages, Clicks, Impressions, CTR, Position. */
function readCsv(file) {
  const lines = readFileSync(file, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  const cells = (l) => [...l.matchAll(/("([^"]|"")*"|[^,]*)(,|$)/g)].map((m) => m[1].replace(/^"|"$/g, "").replace(/""/g, '"')).slice(0, -1);
  const head = cells(lines[0]).map((h) => h.toLowerCase());
  const col = (re) => head.findIndex((h) => re.test(h));
  const [p, c, i, t, pos] = [col(/page|url/), col(/click/), col(/impression/), col(/ctr/), col(/position/)];
  if ([p, c, i, pos].some((x) => x < 0)) throw new Error(`${file} does not look like a Search Console Pages export (columns: ${head.join(", ")})`);
  return lines.slice(1).map((l) => {
    const r = cells(l);
    const clicks = Number(r[c]) || 0;
    const impressions = Number(String(r[i]).replace(/,/g, "")) || 0;
    return { path: pathOf(r[p]), clicks, impressions, ctr: t >= 0 ? parseFloat(r[t]) / 100 || 0 : impressions ? clicks / impressions : 0, position: Number(r[pos]) || 0 };
  });
}

// ---------------------------------------------------------------- choosing pages

// Rough organic click-through rate a result at each position earns.
const expectedCtr = (pos) => (pos <= 1.5 ? 0.28 : pos <= 2.5 ? 0.15 : pos <= 3.5 ? 0.1 : pos <= 4.5 ? 0.07 : pos <= 5.5 ? 0.05 : pos <= 10.5 ? 0.03 : pos <= 20.5 ? 0.012 : 0.004);

function pickPages(rows) {
  const recent = (id) => OVERRIDES[id]?.updated && OVERRIDES[id].updated > daysAgo(COOLDOWN);
  return rows
    .filter((r) => toolByPath[r.path] && r.impressions >= MIN_IMPR && !recent(toolByPath[r.path].id))
    .map((r) => {
      const gap = Math.max(0, expectedCtr(r.position) - r.ctr);
      const striking = r.position >= 4 && r.position <= 20;
      // Clicks being missed now, plus a bonus for pages close enough to page 1 / the top 3 to move.
      return { ...r, tool: toolByPath[r.path], score: r.impressions * gap + (striking ? r.impressions * 0.01 : 0), why: [gap > 0.005 ? `CTR ${(r.ctr * 100).toFixed(1)}% vs ~${(expectedCtr(r.position) * 100).toFixed(0)}% expected at position ${r.position.toFixed(1)}` : null, striking ? `position ${r.position.toFixed(1)} (striking distance)` : null].filter(Boolean).join("; ") };
    })
    .filter((r) => r.why)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT);
}

// ---------------------------------------------------------------- writing and checking copy

const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function handWrittenFaqs(tool) {
  const extra = OVERRIDES[tool.id]?.faqs?.length || 0;
  return extra ? tool.faqs.slice(0, tool.faqs.length - extra) : tool.faqs;
}

function problems(tool, p) {
  const out = [];
  const others = TOOLS.filter((t) => t.id !== tool.id);
  if (!p.title || p.title.length < 30 || p.title.length > 60) out.push(`title must be 30–60 characters (it is ${p.title?.length || 0})`);
  if (/freetoolspro/i.test(p.title || "")) out.push("title must not contain the brand name (the site adds it)");
  if (others.some((t) => norm(t.title) === norm(p.title))) out.push("title duplicates another page's title");
  if (!p.description || p.description.length < 110 || p.description.length > 158) out.push(`description must be 110–158 characters (it is ${p.description?.length || 0})`);
  if (others.some((t) => norm(t.description) === norm(p.description))) out.push("description duplicates another page's description");
  const [q, a] = p.answer || [];
  if (!q || !q.trim().endsWith("?") || words(q) < 3 || words(q) > 16) out.push("answer.question must be a 3–16 word question ending in '?'");
  if (words(a) < 30 || words(a) > 85) out.push(`answer.answer must be 30–85 words (it is ${words(a)})`);
  const seen = new Set([...handWrittenFaqs(tool).map(([fq]) => norm(fq)), norm(q)]);
  if (!Array.isArray(p.faqs) || p.faqs.length < 2 || p.faqs.length > 3) out.push("faqs must have 2 or 3 items");
  for (const [fq, fa] of p.faqs || []) {
    if (!fq?.trim().endsWith("?")) out.push(`FAQ "${fq}" must be a question ending in '?'`);
    if (seen.has(norm(fq))) out.push(`FAQ "${fq}" repeats an existing question`);
    seen.add(norm(fq));
    if (words(fa) < 15 || words(fa) > 90) out.push(`FAQ answer for "${fq}" must be 15–90 words`);
  }
  return out;
}

async function propose(tool, metrics, queries) {
  const depth = DEPTH[tool.id] || {};
  const system =
    "You are an SEO, answer-engine (AEO) and generative-search (GEO) editor for FreeToolsPro, a site of free browser-based tools for Indian users. You rewrite a tool page's search copy so more searchers click it and so AI assistants and featured snippets can quote it. Rules: use only facts present in the material given; never invent rates, limits, prices, features or statistics; Indian English; plain, specific wording, no hype; the title starts with the main search phrase people actually use; the quick answer directly answers the most common query in its first sentence and can be quoted on its own.";
  const material = `Tool: ${tool.name} (${SITE.url}${tool.path})
Category: ${categoryById[tool.cat].name}
Current title: ${tool.title}
Current meta description: ${tool.description}
Short line: ${tool.short}
About: ${tool.intro}
${depth.how ? `How it works: ${depth.how}\n` : ""}${depth.formula ? `Formula: ${depth.formula}\n` : ""}${depth.limits?.length ? `Limitations: ${depth.limits.join(" ")}\n` : ""}Existing FAQs (keep; do not repeat):
${handWrittenFaqs(tool).map(([q, a]) => `- ${q} ${a}`).join("\n")}
${metrics ? `\nLast 28 days in Google: ${metrics.impressions} impressions, ${metrics.clicks} clicks, CTR ${(metrics.ctr * 100).toFixed(1)}%, average position ${metrics.position.toFixed(1)}.` : ""}
${queries?.length ? `Top search queries for this page (query: impressions, clicks, position):\n${queries.map((q) => `- ${q.query}: ${q.impressions}, ${q.clicks}, ${q.position.toFixed(1)}`).join("\n")}` : "No query data: target the phrases people most likely search for this tool in India."}`;
  const ask = `${material}

Return JSON:
{"title": "30–60 characters, no brand name",
 "description": "110–158 characters: what the page gives the searcher, with a reason to click (free, no sign-up, instant, private) where true",
 "answer": ["the main query phrased as a question", "30–85 word direct answer, quotable on its own"],
 "faqs": [["new question people search, ending in ?", "15–90 word answer"], 2 or 3 of these, covering queries the existing FAQs miss],
 "reason": "one sentence on what you changed and why"}`;
  let p = await askJson({ system, prompt: ask });
  let issues = problems(tool, p);
  if (issues.length) {
    p = await askJson({ system, prompt: `${ask}\n\nYour previous answer was:\n${JSON.stringify(p)}\nFix these problems and return the full JSON again:\n- ${issues.join("\n- ")}` });
    issues = problems(tool, p);
  }
  return { ...p, issues };
}

// ---------------------------------------------------------------- report

const pct = (x) => `${(x * 100).toFixed(1)}%`;
function reviewEarlier(rows) {
  const byPath = Object.fromEntries(rows.map((r) => [r.path, r]));
  const lines = [];
  for (const [id, o] of Object.entries(OVERRIDES)) {
    if (!o.metricsAtChange || !o.updated || o.updated > daysAgo(31) || !toolById[id]) continue;
    const now = byPath[toolById[id].path];
    const was = o.metricsAtChange;
    if (!now) continue;
    const verdict = now.ctr > was.ctr * 1.1 || now.position < was.position - 1 ? "better" : now.ctr < was.ctr * 0.9 && now.position >= was.position ? "worse: consider `npm run seo:revert -- " + id + "`" : "about the same";
    lines.push(`| ${toolById[id].name} | ${o.updated} | ${pct(was.ctr)} → ${pct(now.ctr)} | ${was.position.toFixed(1)} → ${now.position.toFixed(1)} | ${was.clicks} → ${now.clicks} | ${verdict} |`);
  }
  return lines.length ? ["## Pages changed in earlier runs", "", "| Page | Changed | CTR | Position | Clicks (28 days) | Result |", "|---|---|---|---|---|---|", ...lines, ""] : [];
}

// ---------------------------------------------------------------- main

async function main() {
  if (flag("revert")) {
    const ids = args.filter((a) => !a.startsWith("--"));
    if (!ids.length) throw new Error("Name the tool to revert, e.g. npm run seo:revert -- emi-calculator");
    return ids.forEach(revert);
  }
  const { name, model, key, keyName } = llmConfig();
  if (!key) throw new Error(`${keyName} is not set in .env (LLM_PROVIDER=${name}).`);

  let rows = [];
  let token = null;
  const site = env("GSC_SITE", "sc-domain:freetoolspro.in");
  const csv = option("csv");
  if (csv) rows = readCsv(csv);
  else if (env("GSC_KEY_FILE")) {
    token = await gscToken(resolve(ROOT, env("GSC_KEY_FILE")));
    rows = (await gscQuery(token, site, { dimensions: ["page"], rowLimit: 5000 })).map((r) => ({ path: pathOf(r.keys[0]), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
  }

  let picks;
  const ids = option("ids");
  if (ids) {
    const byPath = Object.fromEntries(rows.map((r) => [r.path, r]));
    picks = ids.split(",").map((id) => {
      const tool = toolById[id.trim()];
      if (!tool) throw new Error(`Unknown tool id '${id}'`);
      return { ...(byPath[tool.path] || {}), tool, why: "requested with --ids" };
    });
  } else {
    if (!rows.length) throw new Error("No Search Console data. Set GSC_KEY_FILE in .env, pass --csv <Pages export>, or name tools with --ids (see automation/README.md).");
    picks = pickPages(rows);
  }

  console.log(`Search Console rows: ${rows.length}. Pages to refresh: ${picks.length}. AI: ${name} (${model}).`);
  const results = [];
  for (const pick of picks) {
    const { tool } = pick;
    let queries = [];
    if (token)
      queries = (await gscQuery(token, site, { dimensions: ["query"], rowLimit: 15, dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "equals", expression: SITE.url + tool.path }] }] })).map((r) => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: r.position }));
    const metrics = pick.impressions != null ? { clicks: pick.clicks, impressions: pick.impressions, ctr: pick.ctr, position: pick.position, from: RANGE.startDate, to: RANGE.endDate } : null;
    process.stdout.write(`- ${tool.id}: `);
    try {
      const p = await propose(tool, metrics, queries);
      console.log(p.issues.length ? `skipped (${p.issues.join("; ")})` : "ok");
      results.push({ tool, pick, metrics, queries, p });
    } catch (e) {
      console.log(`failed (${e.message})`);
      results.push({ tool, pick, metrics, queries, error: e.message });
    }
  }

  const good = results.filter((r) => r.p && !r.p.issues.length);
  if (APPLY && good.length) {
    const next = { ...OVERRIDES };
    for (const { tool, metrics, queries, p } of good) {
      const prev = OVERRIDES[tool.id];
      const { history: prevHistory = [], ...prevEntry } = prev || {};
      next[tool.id] = {
        updated: today(),
        title: p.title,
        description: p.description,
        answer: p.answer,
        faqs: p.faqs,
        reason: p.reason,
        ...(metrics ? { metricsAtChange: metrics } : {}),
        ...(queries.length ? { topQueries: queries.slice(0, 5).map((q) => q.query) } : {}),
        history: prev ? [...prevHistory, prevEntry].slice(-5) : [],
      };
    }
    saveOverrides(next);
  }

  // Report
  const L = [`# SEO refresh ${today()}`, "", `Data: ${csv ? `CSV ${csv}` : token ? `Search Console API (${site})` : "none"}, ${RANGE.startDate} to ${RANGE.endDate}. AI: ${name} (${model}). ${APPLY ? `**Applied ${good.length} change(s) to src/data/seo-overrides.js.**` : "Proposals only: run with `--apply` to use them."}`, ""];
  L.push(...reviewEarlier(rows));
  for (const r of results) {
    L.push(`## ${r.tool.name}`, "", `${SITE.url}${r.tool.path}`, "", `Why: ${r.pick.why}`, "");
    if (r.metrics) L.push(`Last 28 days: ${r.metrics.impressions} impressions, ${r.metrics.clicks} clicks, CTR ${pct(r.metrics.ctr)}, position ${r.metrics.position.toFixed(1)}`, "");
    if (r.queries.length) L.push(`Top queries: ${r.queries.slice(0, 8).map((q) => q.query).join(", ")}`, "");
    if (r.error) {
      L.push(`**Failed:** ${r.error}`, "");
      continue;
    }
    const p = r.p;
    if (p.issues.length) L.push(`**Not applied, failed checks:** ${p.issues.join("; ")}`, "");
    L.push("| | Before | After |", "|---|---|---|", `| Title | ${r.tool.title} | ${p.title} |`, `| Description | ${r.tool.description} | ${p.description} |`, "");
    L.push(`**Quick answer:** ${p.answer?.[0]} ${p.answer?.[1]}`, "", "**New FAQs:**", ...(p.faqs || []).map(([q, a]) => `- **${q}** ${a}`), "", `_${p.reason || ""}_`, "");
  }
  const changed = good.map((r) => r.tool.path);
  if (APPLY && changed.length) L.push("## Next steps", "", "```", "npm run build", "# deploy dist/ as usual, then:", `npm run indexnow -- ${changed.join(" ")}`, "```", "");
  const file = join(REPORT_DIR, `seo-refresh-${today()}.md`);
  writeText(file, L.join("\n"));

  console.log(`\nReport: ${file}`);
  if (APPLY && changed.length) console.log(`Applied ${changed.length} change(s). Next: npm run build, deploy, then npm run indexnow -- ${changed.join(" ")}`);
  else if (!APPLY && good.length) console.log("Nothing on the site changed. Read the report, then run again with --apply (or npm run seo:apply).");
}

main().catch((e) => {
  console.error("error:", e.message);
  process.exit(1);
});
