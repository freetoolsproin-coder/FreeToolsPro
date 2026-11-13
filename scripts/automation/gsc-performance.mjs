// Organic traffic and keyword-opportunity report from Search Console's Search Analytics API. Read-only.
//
// Compares the last 28 days with the 28 days before, and finds what to work on next to grow traffic:
//   • Striking distance: queries a page ranks for at positions 8–20 with real impressions. A better
//     title, an H2 or FAQ that answers the query, and a few internal links can move these onto page 1.
//   • Low CTR: page-1 results whose click-through rate is far below what that position normally earns
//     → rewrite the title and description (npm run seo:refresh does this with AI).
//   • Declining and rising pages: click changes, with the queries that lost or gained the most.
//   • Cannibalisation: two or more of your pages competing for the same query.
//   • Content gaps: queries with demand where your best page ranks beyond 20 or none of your tools
//     matches the query. These are ideas for new tools, sections or FAQs.
//   • Rank tracking: position history for your top queries, kept between runs.
//
//   node scripts/automation/gsc-performance.mjs
//   node scripts/automation/gsc-performance.mjs --days 90          longer window
//
// Settings in .env: GSC_KEY_FILE, GSC_SITE, PERF_MIN_IMPRESSIONS (default 20).
// Output: automation/reports/performance/performance-<date>-*.csv; history automation/state/performance/.
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { ROOT, STATE_DIR, REPORT_DIR, env, option, readJson, writeJson, writeText, today, daysAgo } from "./lib/env.mjs";
import { gscToken, gscCall } from "./lib/gsc.mjs";
import { csv } from "./lib/crawl.mjs";

const SITE_URL = env("INDEX_SITE_URL", "https://freetoolspro.in").replace(/\/$/, "");
const GSC_SITE = env("GSC_SITE", `sc-domain:${new URL(SITE_URL).host}`);
const DAYS = Number(option("days", "28"));
const MIN_IMPR = Number(env("PERF_MIN_IMPRESSIONS", "20"));
const OUT_DIR = join(REPORT_DIR, "performance");
const HIST_DIR = join(STATE_DIR, "performance");

// Typical organic CTR by position (blended industry curves; used only to spot outliers).
const EXPECTED_CTR = [0, 0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.03, 0.025, 0.02, 0.018];
const expCtr = (pos) => EXPECTED_CTR[Math.min(10, Math.max(1, Math.round(pos)))] ?? 0.01;

const short = (u) => u.replace(SITE_URL, "") || "/";
const pct = (x) => `${(x * 100).toFixed(1)}%`;

async function query(token, startDate, endDate, dimensions) {
  const rows = [];
  for (let startRow = 0; ; startRow += 25000) {
    const j = await gscCall(token, `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`, {
      method: "POST",
      body: { startDate, endDate, dimensions, rowLimit: 25000, startRow, type: "web" },
    });
    const got = j.rows || [];
    rows.push(...got.map((r) => ({ ...Object.fromEntries(dimensions.map((d, i) => [d, r.keys[i]])), clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })));
    if (got.length < 25000) return rows;
  }
}

async function main() {
  const date = today();
  const keyFile = resolve(ROOT, env("GSC_KEY_FILE", "automation/state/gsc-key.json"));
  const { token } = await gscToken(keyFile);
  // Search Console data lags 2–3 days.
  const end = daysAgo(3);
  const start = daysAgo(3 + DAYS - 1);
  const pEnd = daysAgo(3 + DAYS);
  const pStart = daysAgo(3 + 2 * DAYS - 1);
  console.log(`Search Console ${GSC_SITE}: ${start}..${end} vs ${pStart}..${pEnd}`);

  const [qp, qpPrev, pages, pagesPrev] = await Promise.all([
    query(token, start, end, ["query", "page"]),
    query(token, pStart, pEnd, ["query", "page"]),
    query(token, start, end, ["page"]),
    query(token, pStart, pEnd, ["page"]),
  ]);
  console.log(`  ${pages.length} pages and ${qp.length} query/page rows with impressions.`);

  let catalog = null;
  try {
    catalog = await import("../../src/data/catalog.js");
  } catch {}
  const toolWords = (catalog?.TOOLS || []).map((t) => ({ path: t.path, words: new Set(`${t.name} ${t.short || ""} ${t.id}`.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2)) }));

  // ---------------------------------------------------------------- totals
  const sum = (rs, k) => rs.reduce((a, r) => a + r[k], 0);
  const totals = { clicks: sum(pages, "clicks"), impressions: sum(pages, "impressions"), prevClicks: sum(pagesPrev, "clicks"), prevImpressions: sum(pagesPrev, "impressions") };
  totals.ctr = totals.impressions ? totals.clicks / totals.impressions : 0;
  const wpos = (rs) => {
    const imp = sum(rs, "impressions");
    return imp ? rs.reduce((a, r) => a + r.position * r.impressions, 0) / imp : 0;
  };
  totals.position = +wpos(pages).toFixed(1);
  totals.prevPosition = +wpos(pagesPrev).toFixed(1);

  // ---------------------------------------------------------------- pages: declining / rising
  const prevPage = new Map(pagesPrev.map((r) => [r.page, r]));
  const qpByPage = (rows) => {
    const m = new Map();
    for (const r of rows) (m.get(r.page) || m.set(r.page, new Map()).get(r.page)).set(r.query, r);
    return m;
  };
  const nowQ = qpByPage(qp);
  const prevQ = qpByPage(qpPrev);
  const pageRows = pages
    .map((r) => {
      const p = prevPage.get(r.page) || { clicks: 0, impressions: 0, position: 0 };
      const dc = r.clicks - p.clicks;
      let movers = "";
      if (Math.abs(dc) >= 5) {
        const qs = new Set([...(nowQ.get(r.page)?.keys() || []), ...(prevQ.get(r.page)?.keys() || [])]);
        movers = [...qs]
          .map((q) => ({ q, d: (nowQ.get(r.page)?.get(q)?.clicks || 0) - (prevQ.get(r.page)?.get(q)?.clicks || 0) }))
          .sort((a, b) => (dc < 0 ? a.d - b.d : b.d - a.d))
          .slice(0, 3)
          .filter((x) => x.d)
          .map((x) => `${x.q} (${x.d > 0 ? "+" : ""}${x.d})`)
          .join("; ");
      }
      return {
        page: r.page,
        clicks: r.clicks,
        prev_clicks: p.clicks,
        click_change: dc,
        impressions: r.impressions,
        prev_impressions: p.impressions,
        ctr: pct(r.ctr),
        position: r.position.toFixed(1),
        prev_position: p.position ? p.position.toFixed(1) : "",
        trend: p.clicks >= 10 && dc <= -0.3 * p.clicks ? "declining" : r.clicks >= 10 && dc >= 0.3 * Math.max(p.clicks, 1) ? "rising" : "",
        top_movers: movers,
      };
    })
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  // ---------------------------------------------------------------- striking distance and low CTR
  const striking = qp
    .filter((r) => r.position >= 8 && r.position <= 20 && r.impressions >= MIN_IMPR)
    .map((r) => ({
      query: r.query,
      page: r.page,
      impressions: r.impressions,
      clicks: r.clicks,
      position: r.position.toFixed(1),
      potential_clicks: Math.round(r.impressions * expCtr(3) - r.clicks),
      action: `Use "${r.query}" in the title or an H2, answer it directly in a FAQ, and link to this page from 2–3 related pages with that anchor text.`,
    }))
    .sort((a, b) => b.potential_clicks - a.potential_clicks);

  const lowCtr = qp
    .filter((r) => r.position <= 10 && r.impressions >= Math.max(MIN_IMPR, 50) && r.ctr < expCtr(r.position) * 0.5)
    .map((r) => ({
      query: r.query,
      page: r.page,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: pct(r.ctr),
      expected_ctr: pct(expCtr(r.position)),
      position: r.position.toFixed(1),
      lost_clicks: Math.round(r.impressions * expCtr(r.position) - r.clicks),
      action: "Rewrite the title and meta description around this query (npm run seo:refresh). Check whether a rich result or AI overview is taking the clicks.",
    }))
    .sort((a, b) => b.lost_clicks - a.lost_clicks);

  // ---------------------------------------------------------------- cannibalisation
  const byQuery = new Map();
  for (const r of qp) (byQuery.get(r.query) || byQuery.set(r.query, []).get(r.query)).push(r);
  const cannibal = [];
  for (const [q, rs] of byQuery) {
    const tot = sum(rs, "impressions");
    if (tot < MIN_IMPR * 2) continue;
    const serious = rs.filter((r) => r.impressions >= 0.15 * tot && r.position <= 30);
    if (serious.length >= 2)
      cannibal.push({
        query: q,
        impressions: tot,
        pages: serious.sort((a, b) => a.position - b.position).map((r) => `${short(r.page)} (pos ${r.position.toFixed(1)}, ${r.impressions} impr)`).join(" | "),
        action: "Pick one page to rank for this query. Make the others clearly about something else and link them to the chosen page with the query as anchor text.",
      });
  }
  cannibal.sort((a, b) => b.impressions - a.impressions);

  // ---------------------------------------------------------------- content gaps
  const gaps = [];
  for (const [q, rs] of byQuery) {
    const tot = sum(rs, "impressions");
    if (tot < MIN_IMPR) continue;
    const best = rs.reduce((a, b) => (a.position < b.position ? a : b));
    const words = q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
    const match = toolWords.length ? toolWords.find((t) => words.filter((w) => t.words.has(w)).length >= Math.min(2, words.length)) : null;
    if (best.position > 20 || (toolWords.length && !match))
      gaps.push({
        query: q,
        impressions: tot,
        best_position: best.position.toFixed(1),
        best_page: short(best.page),
        matching_tool: match ? match.path : "",
        idea: match
          ? `Ranks poorly. Add a section or FAQ on "${q}" to ${match.path}, or a dedicated page if the intent differs.`
          : `No tool targets this. Consider a new tool or guide for "${q}".`,
      });
  }
  gaps.sort((a, b) => b.impressions - a.impressions);

  // ---------------------------------------------------------------- rank tracking
  const queries = new Map();
  for (const r of qp) {
    const x = queries.get(r.query) || { clicks: 0, impressions: 0, pw: 0 };
    x.clicks += r.clicks;
    x.impressions += r.impressions;
    x.pw += r.position * r.impressions;
    queries.set(r.query, x);
  }
  const topQueries = [...queries].map(([q, x]) => ({ query: q, clicks: x.clicks, impressions: x.impressions, position: +(x.pw / x.impressions).toFixed(1) })).sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 200);
  const hist = (() => {
    try {
      return readdirSync(HIST_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f !== `${date}.json`).sort();
    } catch {
      return [];
    }
  })();
  const prevRun = hist.length ? readJson(join(HIST_DIR, hist[hist.length - 1]), null) : null;
  const prevPos = new Map((prevRun?.topQueries || []).map((r) => [r.query, r.position]));
  const tracked = topQueries.map((r) => ({ ...r, previous_run: prevRun?.date || "", previous_position: prevPos.get(r.query) ?? "", movement: prevPos.has(r.query) ? +(prevPos.get(r.query) - r.position).toFixed(1) : "new" }));

  // ---------------------------------------------------------------- write
  const base = join(OUT_DIR, `performance-${date}`);
  writeText(`${base}-pages.csv`, csv(pageRows, Object.keys(pageRows[0] || { page: "" })));
  writeText(`${base}-striking-distance.csv`, csv(striking, ["query", "page", "impressions", "clicks", "position", "potential_clicks", "action"]));
  writeText(`${base}-low-ctr.csv`, csv(lowCtr, ["query", "page", "impressions", "clicks", "ctr", "expected_ctr", "position", "lost_clicks", "action"]));
  writeText(`${base}-cannibalisation.csv`, csv(cannibal, ["query", "impressions", "pages", "action"]));
  writeText(`${base}-content-gaps.csv`, csv(gaps, ["query", "impressions", "best_position", "best_page", "matching_tool", "idea"]));
  writeText(`${base}-rank-tracking.csv`, csv(tracked, ["query", "clicks", "impressions", "position", "previous_position", "movement", "previous_run"]));
  const summary = {
    date,
    window: `${start}..${end}`,
    previousWindow: `${pStart}..${pEnd}`,
    ...totals,
    pages: pages.length,
    queries: queries.size,
    declining: pageRows.filter((r) => r.trend === "declining").length,
    rising: pageRows.filter((r) => r.trend === "rising").length,
  };
  writeJson(join(HIST_DIR, `${date}.json`), { date, topQueries });
  writeJson(join(HIST_DIR, "latest.json"), {
    summary,
    topPages: pageRows.slice(0, 15),
    declining: pageRows.filter((r) => r.trend === "declining").slice(0, 15),
    striking: striking.slice(0, 20),
    lowCtr: lowCtr.slice(0, 15),
    cannibal: cannibal.slice(0, 10),
    gaps: gaps.slice(0, 20),
    movers: tracked.filter((r) => typeof r.movement === "number" && Math.abs(r.movement) >= 2).slice(0, 20),
    files: base,
  });

  const ch = (a, b) => (b ? `${a - b >= 0 ? "+" : ""}${(((a - b) / b) * 100).toFixed(0)}%` : "");
  console.log(`\nClicks ${totals.clicks} (${ch(totals.clicks, totals.prevClicks)}), impressions ${totals.impressions} (${ch(totals.impressions, totals.prevImpressions)}), CTR ${pct(totals.ctr)}, avg position ${totals.position} (was ${totals.prevPosition}).`);
  console.log(`${striking.length} striking-distance queries, ${lowCtr.length} low-CTR, ${cannibal.length} cannibalised, ${gaps.length} content gaps; ${summary.declining} declining and ${summary.rising} rising pages.`);
  console.log(`Reports: ${base}-*.csv`);
}

main().catch((e) => {
  console.error("error:", e.message);
  process.exit(1);
});
