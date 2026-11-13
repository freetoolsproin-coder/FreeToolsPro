// Mobile performance and Core Web Vitals monitor, using Google's PageSpeed Insights API (Lighthouse
// lab data + Chrome UX Report field data from real visitors). Read-only.
//
// For the home page, every category hub, /tools and the most important tools it records, per device:
//   • field data (real Chrome users, last 28 days) for the page, or for the whole origin when the page
//     has too little traffic: LCP, INP, CLS at the 75th percentile, and Google's pass/fail verdict
//   • Lighthouse lab scores: Performance, Accessibility, Best Practices, SEO
//   • lab metrics: LCP, CLS, TBT (the lab stand-in for INP), FCP, Speed Index
//   • the top opportunities Lighthouse suggests, with estimated savings
// and compares with the previous run so regressions stand out.
//
//   node scripts/automation/cwv-monitor.mjs                      default page set, mobile + desktop
//   node scripts/automation/cwv-monitor.mjs --mobile-only
//   node scripts/automation/cwv-monitor.mjs --pages / /calculators/emi-calculator
//
// Settings in .env: PSI_API_KEY (free from console.cloud.google.com → enable "PageSpeed Insights API";
// without a key Google allows only a few requests), CWV_TOOL_LIMIT (default 12), INDEX_SITE_URL.
// Output: automation/reports/cwv/cwv-<date>.csv; history: automation/state/cwv/<date>.json
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { STATE_DIR, REPORT_DIR, env, flag, args, readJson, writeJson, writeText, today } from "./lib/env.mjs";
import { pool, sleep, csv } from "./lib/crawl.mjs";

const SITE_URL = env("INDEX_SITE_URL", "https://freetoolspro.in").replace(/\/$/, "");
const KEY = env("PSI_API_KEY", "");
const TOOL_LIMIT = Number(env("CWV_TOOL_LIMIT", "12"));
const STRATEGIES = flag("mobile-only") ? ["mobile"] : ["mobile", "desktop"];
const HIST_DIR = join(STATE_DIR, "cwv");

// Google's Core Web Vitals thresholds (good ≤ first, poor > second).
const LIMITS = { lcp: [2500, 4000], inp: [200, 500], cls: [0.1, 0.25], tbt: [200, 600], fcp: [1800, 3000] };
const rate = (m, v) => (v == null || v === "" ? "" : v <= LIMITS[m][0] ? "good" : v <= LIMITS[m][1] ? "needs improvement" : "poor");

async function pagePaths() {
  const i = args.indexOf("--pages");
  if (i >= 0) return args.slice(i + 1).filter((a) => a.startsWith("/"));
  let cat = null;
  try {
    cat = await import("../../src/data/catalog.js");
  } catch {}
  if (!cat) return ["/", "/tools"];
  const top = [...cat.TOOLS].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || (a.rank ?? 999) - (b.rank ?? 999)).slice(0, TOOL_LIMIT);
  return ["/", "/tools", ...cat.CATEGORIES.map((c) => c.path), ...top.map((t) => t.path)];
}

async function psi(url, strategy) {
  const q = new URLSearchParams({ url, strategy });
  for (const c of ["performance", "accessibility", "best-practices", "seo"]) q.append("category", c);
  if (KEY) q.set("key", KEY);
  for (let attempt = 0; ; attempt++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 120000);
    try {
      const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal: ctl.signal });
      const j = await r.json();
      if (r.ok) return j;
      if ((r.status === 429 || r.status >= 500) && attempt < 3) {
        await sleep(15000 * (attempt + 1));
        continue;
      }
      throw new Error(`PSI ${r.status}: ${j.error?.message || "error"}${r.status === 429 && !KEY ? " (set PSI_API_KEY in .env)" : ""}`);
    } catch (e) {
      if (e.name === "AbortError" && attempt < 2) continue;
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }
}

function extract(j) {
  const lh = j.lighthouseResult || {};
  const au = lh.audits || {};
  const num = (id) => au[id]?.numericValue;
  const score = (c) => (lh.categories?.[c]?.score == null ? "" : Math.round(lh.categories[c].score * 100));
  const field = (le) => {
    const m = le?.metrics || {};
    const p = (k) => m[k]?.percentile;
    return {
      lcp: p("LARGEST_CONTENTFUL_PAINT_MS") ?? "",
      inp: p("INTERACTION_TO_NEXT_PAINT") ?? "",
      cls: p("CUMULATIVE_LAYOUT_SHIFT_SCORE") != null ? p("CUMULATIVE_LAYOUT_SHIFT_SCORE") / 100 : "",
      verdict: le?.overall_category || "",
    };
  };
  const page = field(j.loadingExperience);
  const origin = field(j.originLoadingExperience);
  const hasPage = j.loadingExperience && !j.loadingExperience.origin_fallback && page.lcp !== "";
  const fieldData = hasPage ? page : origin;
  const opportunities = Object.values(au)
    .filter((a) => a.details?.type === "opportunity" && (a.details.overallSavingsMs || 0) >= 100)
    .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
    .slice(0, 3)
    .map((a) => `${a.title} (~${(a.details.overallSavingsMs / 1000).toFixed(1)} s)`);
  return {
    field_source: fieldData.lcp !== "" ? (hasPage ? "page" : "origin") : "none",
    field_verdict: fieldData.verdict === "FAST" ? "pass" : fieldData.verdict === "AVERAGE" || fieldData.verdict === "SLOW" ? "fail" : "",
    field_lcp_ms: fieldData.lcp,
    field_inp_ms: fieldData.inp,
    field_cls: fieldData.cls,
    performance: score("performance"),
    accessibility: score("accessibility"),
    best_practices: score("best-practices"),
    seo: score("seo"),
    lab_lcp_ms: num("largest-contentful-paint") != null ? Math.round(num("largest-contentful-paint")) : "",
    lab_cls: num("cumulative-layout-shift") != null ? +num("cumulative-layout-shift").toFixed(3) : "",
    lab_tbt_ms: num("total-blocking-time") != null ? Math.round(num("total-blocking-time")) : "",
    lab_fcp_ms: num("first-contentful-paint") != null ? Math.round(num("first-contentful-paint")) : "",
    lab_speed_index_ms: num("speed-index") != null ? Math.round(num("speed-index")) : "",
    top_opportunities: opportunities,
    seo_failures: (lh.categories?.seo?.auditRefs || []).filter((r) => au[r.id]?.score === 0).map((r) => au[r.id].title),
  };
}

async function main() {
  const date = today();
  const paths = await pagePaths();
  const jobs = paths.flatMap((p) => STRATEGIES.map((s) => ({ path: p, strategy: s })));
  console.log(`PageSpeed Insights: ${paths.length} page(s) × ${STRATEGIES.join("+")} = ${jobs.length} run(s)${KEY ? "" : " (no PSI_API_KEY: may hit the anonymous limit)"}.`);

  const hist = (() => {
    try {
      return readdirSync(HIST_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f !== `${date}.json`).sort();
    } catch {
      return [];
    }
  })();
  const prev = hist.length ? readJson(join(HIST_DIR, hist[hist.length - 1]), null) : null;
  const prevMap = new Map((prev?.rows || []).map((r) => [`${r.url}|${r.device}`, r]));

  const rows = await pool(jobs, KEY ? 4 : 1, async ({ path, strategy }) => {
    const url = SITE_URL + (path === "/" ? "/" : path);
    try {
      const x = extract(await psi(url, strategy));
      const was = prevMap.get(`${url}|${strategy}`);
      const flags = [];
      if (x.field_verdict === "fail") flags.push("Fails Core Web Vitals (real users)");
      for (const [m, k] of [["lcp", "field_lcp_ms"], ["inp", "field_inp_ms"], ["cls", "field_cls"]]) if (rate(m, x[k]) === "poor") flags.push(`Field ${m.toUpperCase()} poor`);
      if (rate("lcp", x.lab_lcp_ms) === "poor") flags.push(`Lab LCP ${(x.lab_lcp_ms / 1000).toFixed(1)} s`);
      if (rate("cls", x.lab_cls) === "poor") flags.push(`Lab CLS ${x.lab_cls}`);
      if (rate("tbt", x.lab_tbt_ms) === "poor") flags.push(`TBT ${x.lab_tbt_ms} ms (hurts INP)`);
      if (x.seo !== "" && x.seo < 90) flags.push(`Lighthouse SEO ${x.seo}`);
      if (was && was.performance !== "" && x.performance !== "" && x.performance <= was.performance - 10) flags.push(`Performance dropped ${was.performance} → ${x.performance}`);
      console.log(`  ${strategy.padEnd(7)} ${path.padEnd(48)} perf ${String(x.performance).padStart(3)}  LCP ${x.lab_lcp_ms} ms  CLS ${x.lab_cls}  field: ${x.field_verdict || "n/a"}`);
      return { url, device: strategy, ...x, lcp_rating: rate("lcp", x.field_lcp_ms !== "" ? x.field_lcp_ms : x.lab_lcp_ms), inp_rating: rate("inp", x.field_inp_ms), cls_rating: rate("cls", x.field_cls !== "" ? x.field_cls : x.lab_cls), previous_performance: was?.performance ?? "", flags };
    } catch (e) {
      console.log(`  ${strategy.padEnd(7)} ${path}: ${e.message}`);
      return { url, device: strategy, error: e.message, flags: [`PSI failed: ${e.message}`] };
    }
  });

  const cols = ["url", "device", "field_source", "field_verdict", "field_lcp_ms", "field_inp_ms", "field_cls", "lcp_rating", "inp_rating", "cls_rating", "performance", "previous_performance", "accessibility", "best_practices", "seo", "lab_lcp_ms", "lab_cls", "lab_tbt_ms", "lab_fcp_ms", "lab_speed_index_ms", "top_opportunities", "seo_failures", "flags", "error"];
  const out = join(REPORT_DIR, "cwv", `cwv-${date}.csv`);
  writeText(out, csv(rows, cols));
  const ok = rows.filter((r) => !r.error);
  const avg = (k, d) => {
    const v = ok.filter((r) => r.device === d && r[k] !== "").map((r) => r[k]);
    return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : "";
  };
  const origin = ok.find((r) => r.field_source !== "none");
  const summary = {
    date,
    runs: rows.length,
    failed: rows.length - ok.length,
    avgPerformanceMobile: avg("performance", "mobile"),
    avgPerformanceDesktop: avg("performance", "desktop"),
    avgSeoMobile: avg("seo", "mobile"),
    pagesFailingField: ok.filter((r) => r.field_verdict === "fail").length,
    pagesWithFlags: rows.filter((r) => r.flags.length).length,
    originVerdict: origin ? origin.field_verdict : "",
    file: out,
  };
  writeJson(join(HIST_DIR, `${date}.json`), { date, summary, rows });
  writeJson(join(HIST_DIR, "latest.json"), { ...summary, rows });
  console.log(`\nMobile performance avg ${summary.avgPerformanceMobile}, desktop ${summary.avgPerformanceDesktop}; ${summary.pagesWithFlags} page/device(s) flagged.`);
  console.log(`Report: ${out}`);
}

main().catch((e) => {
  console.error("error:", e.message);
  process.exit(1);
});
