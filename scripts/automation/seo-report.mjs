// Combines the latest results of every SEO job into one page you can open in a browser:
//   automation/reports/seo-health-<date>.html  (and seo-health-latest.html, always the newest)
//
// Sources (whichever exist): the indexing monitor's CSVs, sitemap-submit, seo-audit and cwv-monitor.
// It lists the alerts that need attention first, then indexing coverage, the fix list, sitemap status,
// technical issues, internal-link suggestions and Core Web Vitals.
//
//   node scripts/automation/seo-report.mjs
//
// Optional alert: set SEO_ALERT_WEBHOOK in .env to a Slack, Discord or Google Chat incoming-webhook URL
// and the alert summary is posted there whenever there is something to act on.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { STATE_DIR, REPORT_DIR, env, readJson, writeText, today } from "./lib/env.mjs";
import { parseCsv } from "./lib/crawl.mjs";

const SITE_URL = env("INDEX_SITE_URL", "https://freetoolspro.in").replace(/\/$/, "");
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const short = (u) => String(u || "").replace(SITE_URL, "") || "/";
const link = (u) => (/^https?:\/\//.test(u) ? `<a href="${esc(u)}">${esc(short(u))}</a>` : esc(u));

function latestIndexing() {
  const dir = join(REPORT_DIR, "indexing");
  if (!existsSync(dir)) return null;
  const dates = readdirSync(dir).map((f) => (f.match(/^indexing-(\d{4}-\d{2}-\d{2})-summary\.csv$/) || [])[1]).filter(Boolean).sort();
  if (!dates.length) return null;
  const d = dates[dates.length - 1];
  const read = (suffix) => {
    const f = join(dir, `indexing-${d}${suffix}.csv`);
    return existsSync(f) ? parseCsv(readFileSync(f, "utf8")) : [];
  };
  const summary = Object.fromEntries(read("-summary").map((r) => [r.metric, r]));
  return { date: d, summary, fixes: read("-fixes"), manual: read("-manual-requests"), changes: read("-changes") };
}

function table(rows, cols, empty = "Nothing to show.") {
  if (!rows.length) return `<p class="muted">${empty}</p>`;
  return `<div class="tw"><table><thead><tr>${cols.map(([, h]) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${cols.map(([k, , fmt]) => `<td>${fmt ? fmt(r[k], r) : esc(r[k])}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
}
const pill = (v) => {
  const s = String(v).toLowerCase();
  const cls = /^(error|poor|fail|high|dropped)/.test(s) ? "bad" : /^(warning|needs|medium)/.test(s) ? "warn" : /^(good|pass|indexed|ok|newly)/.test(s) ? "good" : "";
  return v === "" || v == null ? "" : `<span class="pill ${cls}">${esc(v)}</span>`;
};

async function main() {
  const date = today();
  const ix = latestIndexing();
  const sm = readJson(join(STATE_DIR, "sitemap-latest.json"), null);
  const audit = readJson(join(STATE_DIR, "audit", "latest-live.json"), null) || readJson(join(STATE_DIR, "audit", "latest-dist.json"), null);
  const cwv = readJson(join(STATE_DIR, "cwv", "latest.json"), null);
  const perf = readJson(join(STATE_DIR, "performance", "latest.json"), null);

  // ---------------------------------------------------------------- alerts
  const alerts = [];
  const v = (m) => ix?.summary[m]?.value ?? "";
  if (ix) {
    const dropped = Number(v("Dropped from index since previous run")) || 0;
    if (dropped) alerts.push(["error", `${dropped} URL(s) dropped out of Google's index since the previous run.`]);
    for (const c of ["Server errors", "Blocked by robots.txt", "Excluded by noindex"]) {
      const n = Number(v(`Category: ${c}`)) || 0;
      if (n) alerts.push(["error", `${n} sitemap URL(s): ${c}.`]);
    }
    const ready = Number(v("URLs ready for a manual indexing request")) || 0;
    if (ready) alerts.push(["notice", `${ready} URL(s) are ready for a manual "Request indexing" in Search Console (the quota is about 10 a day).`]);
  } else alerts.push(["notice", "No indexing monitor results yet. Run: node scripts/automation/gsc-index-monitor.mjs"]);
  if (sm) {
    const errs = sm.problems.filter((p) => p.severity === "error").length;
    if (errs) alerts.push(["error", `The sitemap has ${errs} validation error(s); it was not submitted.`]);
    if (/^(Failed|Sent, but NOT)/.test(sm.submission)) alerts.push(["error", `Sitemap submission: ${sm.submission}`]);
    for (const g of sm.gsc || []) if (g.errors) alerts.push(["error", `Search Console reports ${g.errors} error(s) reading ${short(g.sitemap)}.`]);
  }
  if (audit) {
    if (audit.errors) alerts.push(["error", `Technical audit: ${audit.errors} error(s)${audit.newIssues ? `, ${audit.newIssues} new issue(s) since ${audit.previousDate}` : ""}.`]);
    if (audit.brokenLinks) alerts.push(["error", `${audit.brokenLinks} broken link(s) found.`]);
  } else alerts.push(["notice", "No technical audit yet. Run: node scripts/automation/seo-audit.mjs"]);
  if (cwv) {
    if (cwv.pagesFailingField) alerts.push(["error", `${cwv.pagesFailingField} page/device(s) fail Core Web Vitals for real users.`]);
    const flagged = (cwv.rows || []).filter((r) => r.flags?.some((f) => /dropped/i.test(f)));
    if (flagged.length) alerts.push(["warning", `Performance regressed on ${flagged.length} page/device(s).`]);
  }

  if (perf) {
    if (perf.declining.length) alerts.push(["warning", `${perf.declining.length} page(s) lost 30%+ of their clicks: ${perf.declining.slice(0, 3).map((r) => short(r.page)).join(", ")}.`]);
    if (perf.striking.length) alerts.push(["notice", `${perf.striking.length} striking-distance queries (positions 8–20) could reach page 1; the top one is "${perf.striking[0].query}".`]);
  }

  // ---------------------------------------------------------------- cards
  const card = (label, value, sub = "", tone = "") => `<div class="card ${tone}"><div class="lbl">${esc(label)}</div><div class="val">${esc(value)}</div><div class="sub">${sub}</div></div>`;
  const cov = v("Index coverage");
  const pc = (a, b) => (b ? `${a - b >= 0 ? "+" : ""}${Math.round(((a - b) / b) * 100)}%` : "");
  const cards = [
    ...(perf ? [card("Organic clicks (28 days)", perf.summary.clicks.toLocaleString("en-IN"), `${pc(perf.summary.clicks, perf.summary.prevClicks)} vs previous 28 days · ${perf.summary.impressions.toLocaleString("en-IN")} impressions · avg pos ${perf.summary.position}`, perf.summary.clicks < perf.summary.prevClicks * 0.9 ? "bad" : perf.summary.clicks > perf.summary.prevClicks ? "good" : "")] : []),
    card("Index coverage", cov || "–", ix ? `${esc(v("Indexed URLs"))} of ${esc(v("Total URLs inspected"))} indexed · ${esc(ix.summary["Indexed URLs"]?.change || "±0")} since last run` : "no data", cov && parseFloat(cov) < 70 ? "warn" : ""),
    card("Sitemap", sm ? `${sm.urlCount} URLs` : "–", sm ? esc(sm.submission.split(":")[0]) + ` · ${sm.added} added, ${sm.updated} updated` : "no data", sm?.problems?.some((p) => p.severity === "error") ? "bad" : ""),
    card("Audit errors", audit ? audit.errors : "–", audit ? `${audit.warnings} warnings · ${audit.notices} notices · ${audit.pages} pages (${esc(audit.mode)})` : "no data", audit?.errors ? "bad" : audit ? "good" : ""),
    card("Mobile performance", cwv ? cwv.avgPerformanceMobile : "–", cwv ? `desktop ${cwv.avgPerformanceDesktop} · real-user CWV: ${esc(cwv.originVerdict || "not enough data")}` : "no data", cwv && cwv.avgPerformanceMobile !== "" && cwv.avgPerformanceMobile < 50 ? "bad" : cwv && cwv.avgPerformanceMobile < 90 ? "warn" : cwv ? "good" : ""),
  ].join("");

  // ---------------------------------------------------------------- sections
  const sections = [];
  sections.push(`<section><h2>Needs attention</h2>${alerts.length ? `<ul class="alerts">${alerts.map(([s, t]) => `<li>${pill(s)} ${esc(t)}</li>`).join("")}</ul>` : '<p class="good-msg">Nothing needs attention today.</p>'}</section>`);

  if (perf) {
    sections.push(`<section><h2>Organic traffic and keyword opportunities <span class="muted">· ${esc(perf.summary.window)}</span></h2>
      <h3>Striking distance: queries on positions 8–20</h3>${table(perf.striking, [["query", "Query"], ["page", "Page", link], ["impressions", "Impr."], ["position", "Pos."], ["potential_clicks", "Extra clicks on page 1"]], "None yet.")}
      <h3>Low click-through rate on page 1</h3>${table(perf.lowCtr, [["query", "Query"], ["page", "Page", link], ["position", "Pos."], ["ctr", "CTR"], ["expected_ctr", "Typical"], ["lost_clicks", "Clicks missed"]], "None.")}
      <h3>Declining pages</h3>${table(perf.declining, [["page", "Page", link], ["clicks", "Clicks"], ["prev_clicks", "Before"], ["position", "Pos."], ["prev_position", "Was"], ["top_movers", "Queries that changed most"]], "No page lost 30% or more of its clicks.")}
      <h3>Pages competing for the same query</h3>${table(perf.cannibal, [["query", "Query"], ["impressions", "Impr."], ["pages", "Pages"]], "None.")}
      <h3>Content gaps: ideas for new tools, sections and FAQs</h3>${table(perf.gaps, [["query", "Query"], ["impressions", "Impr."], ["best_position", "Best pos."], ["best_page", "Best page"], ["idea", "Idea"]], "None.")}
      <h3>Biggest ranking moves</h3>${table(perf.movers, [["query", "Query"], ["position", "Pos."], ["previous_position", "Was"], ["movement", "Change", (m) => (m > 0 ? pill(`good +${m}`) : pill(`poor ${m}`))]], "No moves of 2+ positions since the previous run.")}
      <p class="muted">Full CSVs: ${esc(String(perf.files).split(/[\\/]/).pop())}-*.csv</p></section>`);
  }

  if (ix) {
    const cats = Object.values(ix.summary).filter((r) => r.metric.startsWith("Category: "));
    sections.push(`<section><h2>Google indexing <span class="muted">· ${esc(ix.date)}</span></h2>
      ${table(cats.map((r) => ({ ...r, metric: r.metric.replace("Category: ", "") })), [["metric", "Status"], ["value", "URLs"], ["previous", "Previous"], ["change", "Change"]])}
      <h3>Status changes since the previous run</h3>${table(ix.changes.slice(0, 30), [["url", "URL", link], ["previous", "Was"], ["current", "Now"], ["change", "Change", pill]], "No changes.")}
      <h3>Fixes, most important pages first</h3>${table(ix.fixes.slice(0, 40), [["priority", "Priority", pill], ["url", "URL", link], ["category", "Status"], ["issue", "Issue"], ["fix", "Fix"]], "No indexing fixes needed.")}
      ${ix.fixes.length > 40 ? `<p class="muted">${ix.fixes.length - 40} more in indexing-${esc(ix.date)}-fixes.csv</p>` : ""}
      <h3>Request indexing manually</h3>${table(ix.manual.slice(0, 20), [["priority", "Priority", pill], ["url", "URL", link], ["when", "When"], ["open_url_inspection", "", (u) => `<a href="${esc(u)}">Open in Search Console</a>`]], "Nothing to request.")}</section>`);
  }

  if (sm) {
    sections.push(`<section><h2>Sitemap <span class="muted">· ${esc(sm.date)}</span></h2>
      <p>${esc(sm.submission)}<br><span class="muted">IndexNow: ${esc(sm.indexnow)}</span></p>
      ${table(sm.files.map((f) => ({ ...f })), [["url", "File", link], ["status", "HTTP"], ["count", "Entries"]])}
      ${sm.problems.length ? `<h3>Validation</h3>${table(sm.problems, [["severity", "", pill], ["file", "File", link], ["issue", "Issue"], ["fix", "Fix"]])}` : ""}
      ${sm.gsc?.length ? `<h3>In Search Console</h3>${table(sm.gsc, [["sitemap", "Sitemap", link], ["last_submitted", "Submitted"], ["last_read_by_google", "Last read by Google"], ["urls_submitted", "URLs"], ["errors", "Errors"], ["warnings", "Warnings"]])}` : ""}</section>`);
  }

  if (audit) {
    const checks = Object.entries(audit.byCheck || {}).map(([c, n]) => ({ check: c, ...n })).sort((a, b) => b.error - a.error || b.warning - a.warning);
    sections.push(`<section><h2>Technical SEO audit <span class="muted">· ${esc(audit.date)} · ${esc(audit.mode)}</span></h2>
      ${table(checks, [["check", "Area"], ["error", "Errors"], ["warning", "Warnings"], ["notice", "Notices"]])}
      <h3>Errors and warnings</h3>${table(audit.topIssues.slice(0, 60), [["severity", "", pill], ["check", "Area"], ["url", "URL", link], ["issue", "Issue"], ["fix", "Fix"], ["status", "", (s) => (s === "new" ? pill("new") : "")]], "No errors or warnings.")}
      ${audit.resolved?.length ? `<p class="muted">${audit.resolvedIssues} issue(s) resolved since ${esc(audit.previousDate)}.</p>` : ""}
      <h3>Internal linking suggestions</h3>${table(audit.suggestions.slice(0, 25), [["target", "Page that needs links", link], ["target_contextual_links", "Links now"], ["link_from", "Add a link from", link], ["suggested_anchor", "Anchor text"], ["why", "Why"]], "Every page has enough contextual links.")}
      <p class="muted">Full CSVs: ${Object.values(audit.files || {}).map((f) => esc(f.split(/[\\/]/).pop())).join(" · ")}</p></section>`);
  }

  if (cwv) {
    const fmtMs = (x) => (x === "" || x == null ? "" : `${(x / 1000).toFixed(2)} s`);
    sections.push(`<section><h2>Core Web Vitals and Lighthouse <span class="muted">· ${esc(cwv.date)}</span></h2>
      ${table(cwv.rows || [], [
        ["url", "Page", link],
        ["device", "Device"],
        ["field_verdict", "Real users", (x, r) => (x ? `${pill(x)} <span class="muted">${esc(r.field_source)}</span>` : '<span class="muted">no data</span>')],
        ["lcp_rating", "LCP", (x, r) => `${pill(x)} ${fmtMs(r.field_lcp_ms !== "" ? r.field_lcp_ms : r.lab_lcp_ms)}`],
        ["inp_rating", "INP", (x, r) => (x ? `${pill(x)} ${r.field_inp_ms} ms` : `<span class="muted">TBT ${esc(r.lab_tbt_ms)} ms</span>`)],
        ["cls_rating", "CLS", (x, r) => `${pill(x)} ${esc(r.field_cls !== "" ? r.field_cls : r.lab_cls)}`],
        ["performance", "Perf", (x, r) => `<b>${esc(x)}</b>${r.previous_performance !== "" && r.previous_performance !== x ? ` <span class="muted">(was ${esc(r.previous_performance)})</span>` : ""}`],
        ["seo", "SEO"],
        ["accessibility", "A11y"],
        ["top_opportunities", "Top opportunities", (x) => esc([].concat(x || []).join("; "))],
      ])}</section>`);
  }

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SEO health · ${esc(new URL(SITE_URL).host)} · ${date}</title><meta name="robots" content="noindex">
<style>
:root{--bg:#f7f7f5;--fg:#1b1d22;--mut:#6b6f78;--card:#fff;--line:#e4e4e0;--bad:#c2410c;--badbg:#fdeee6;--warn:#a16207;--warnbg:#fdf5dc;--good:#15803d;--goodbg:#e5f6ea;--acc:#2f5bd3}
@media (prefers-color-scheme:dark){:root{--bg:#111318;--fg:#e8e9ec;--mut:#9095a0;--card:#1a1d24;--line:#2a2e37;--badbg:#3a1f14;--warnbg:#36300f;--goodbg:#13301d;--bad:#fb923c;--warn:#facc15;--good:#4ade80;--acc:#8aa8ff}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1200px;margin:0 auto;padding:28px 20px 60px}h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:0 0 12px}h3{font-size:14px;margin:22px 0 8px}
.muted{color:var(--mut);font-weight:400}a{color:var(--acc);text-decoration:none}a:hover{text-decoration:underline}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:20px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;border-top:3px solid var(--line)}
.card.bad{border-top-color:var(--bad)}.card.warn{border-top-color:var(--warn)}.card.good{border-top-color:var(--good)}
.lbl{color:var(--mut);font-size:12px;text-transform:uppercase;letter-spacing:.04em}.val{font-size:28px;font-weight:650;margin:2px 0}.sub{color:var(--mut);font-size:12.5px}
section{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px 18px 10px;margin:14px 0}
.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13px;margin-bottom:8px}th,td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--mut);font-weight:550;white-space:nowrap}
td a{word-break:break-all}.pill{display:inline-block;padding:1px 8px;border-radius:999px;font-size:11.5px;font-weight:600;background:var(--line);white-space:nowrap}
.pill.bad{background:var(--badbg);color:var(--bad)}.pill.warn{background:var(--warnbg);color:var(--warn)}.pill.good{background:var(--goodbg);color:var(--good)}
.alerts{list-style:none;padding:0;margin:0}.alerts li{padding:7px 0;border-bottom:1px solid var(--line)}.alerts li:last-child{border:0}.good-msg{color:var(--good);font-weight:600}
</style></head><body><main>
<h1>SEO health: ${esc(new URL(SITE_URL).host)}</h1><div class="muted">Generated ${esc(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))} IST · <a href="https://search.google.com/search-console">Search Console</a> · <a href="https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}">PageSpeed</a></div>
<div class="cards">${cards}</div>
${sections.join("\n")}
</main></body></html>`;
  const file = join(REPORT_DIR, `seo-health-${date}.html`);
  writeText(file, html);
  writeText(join(REPORT_DIR, "seo-health-latest.html"), html);
  console.log(`${alerts.filter((a) => a[0] !== "notice").length} alert(s). Report: ${file}`);

  // Markdown summary for GitHub (the workflow keeps one "SEO health" issue up to date with it).
  const act0 = alerts.filter((x) => x[0] !== "notice");
  const md = [
    `## SEO health ${date}`,
    "",
    act0.length ? act0.map(([sv, t]) => `- **${sv}**: ${t}`).join("\n") : "Nothing needs attention.",
    "",
    ...alerts.filter((x) => x[0] === "notice").map(([, t]) => `- ${t}`),
    "",
    perf ? `**Traffic (28 days):** ${perf.summary.clicks} clicks (${pc(perf.summary.clicks, perf.summary.prevClicks) || "n/a"}), ${perf.summary.impressions} impressions, avg position ${perf.summary.position}.` : "",
    perf?.striking?.length ? `\n**Top striking-distance queries:**\n${perf.striking.slice(0, 5).map((r) => `- "${r.query}" → ${short(r.page)} (pos ${r.position}, ~${r.potential_clicks} extra clicks on page 1)`).join("\n")}` : "",
    "",
    "Open the `seo-reports` artifact of this run and see `seo-health-latest.html` for the full report.",
  ].join("\n");
  writeText(join(REPORT_DIR, "seo-alerts.md"), md + "\n");
  writeText(join(REPORT_DIR, "seo-alert-count.txt"), String(act0.length));

  const hook = env("SEO_ALERT_WEBHOOK", "");
  const act = alerts.filter((a) => a[0] !== "notice");
  if (hook && act.length) {
    const text = `SEO health ${new URL(SITE_URL).host} ${date}\n` + act.map(([s, t]) => `• [${s}] ${t}`).join("\n");
    try {
      const r = await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(/discord/.test(hook) ? { content: text.slice(0, 1900) } : { text }) });
      console.log(`Alert webhook: HTTP ${r.status}`);
    } catch (e) {
      console.log(`Alert webhook failed: ${e.message}`);
    }
  }
}

main().catch((e) => {
  console.error("error:", e.stack || e.message);
  process.exit(1);
});
