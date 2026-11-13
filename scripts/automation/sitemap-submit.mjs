// Keeps Google (and Bing/IndexNow) in step with the live sitemap, without anyone remembering to do it.
//
// 1. Reads the live /sitemap.xml and every child sitemap, and validates them (status, XML, namespace,
//    absolute https URLs on this host, valid <lastmod>, no duplicates, under 50,000 URLs).
// 2. Fingerprints the URL list and each URL's <lastmod>, and compares it with the last submission.
// 3. If anything changed (pages added, removed or updated) and the sitemap is valid, it submits
//    /sitemap.xml through the Search Console Sitemaps API, reads it back to confirm, and sends the
//    added/updated URLs to IndexNow (Bing, Yandex, Seznam; Bing also feeds ChatGPT search and Copilot).
// 4. Always reads Search Console's view of every submitted sitemap (last read, errors, warnings,
//    URLs submitted) so a sitemap Google can't read shows up in the report.
//
//   node scripts/automation/sitemap-submit.mjs              submit only if the sitemap changed
//   node scripts/automation/sitemap-submit.mjs --dry-run    show what changed; submit nothing
//   node scripts/automation/sitemap-submit.mjs --force      submit even if nothing changed
//   node scripts/automation/sitemap-submit.mjs --no-indexnow
//
// Settings in .env: GSC_KEY_FILE, GSC_SITE, INDEX_SITE_URL, INDEXNOW_KEY. The service account needs
// **Full** permission in Search Console to submit (Restricted can only read).
// Output: automation/reports/indexing/sitemap-<date>.csv and automation/state/sitemap-submit.json.
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { ROOT, STATE_DIR, REPORT_DIR, env, flag, readJson, writeJson, writeText, today } from "./lib/env.mjs";
import { gscToken, gscCall, SCOPE_READ, SCOPE_WRITE } from "./lib/gsc.mjs";
import { makeSource, readSitemaps, csv } from "./lib/crawl.mjs";

const SITE_URL = env("INDEX_SITE_URL", "https://freetoolspro.in").replace(/\/$/, "");
const HOST = new URL(SITE_URL).host;
const GSC_SITE = env("GSC_SITE", `sc-domain:${HOST}`);
const INDEXNOW_KEY = env("INDEXNOW_KEY", "787cb1b8b400efd9dd8a4225c8fa86a5");
const STATE_FILE = join(STATE_DIR, "sitemap-submit.json");
const FEED = `${SITE_URL}/sitemap.xml`;
const dry = flag("dry-run");
const force = flag("force");

async function indexNow(urlList) {
  if (!urlList.length || flag("no-indexnow")) return "skipped";
  const out = [];
  for (let i = 0; i < urlList.length; i += 10000) {
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList: urlList.slice(i, i + 10000) }),
    });
    out.push(`HTTP ${r.status}`);
  }
  return `${urlList.length} URL(s) sent: ${out.join(", ")}`;
}

async function main() {
  const date = today();
  const src = makeSource({ siteUrl: SITE_URL });
  console.log(`Reading ${FEED} ...`);
  const sm = await readSitemaps(src, FEED);
  const errors = sm.problems.filter((p) => p.severity === "error");
  for (const p of sm.problems) console.log(`  ${p.severity}: ${p.file.replace(SITE_URL, "")}: ${p.issue}`);
  console.log(`  ${sm.files.length} sitemap file(s), ${sm.urls.size} URL(s), ${errors.length} error(s).`);

  const lines = [...sm.urls].map(([u, v]) => `${u} ${v.lastmod}`).sort();
  const fingerprint = createHash("sha256").update(lines.join("\n")).digest("hex");
  const prev = readJson(STATE_FILE, null);
  const prevMap = new Map(Object.entries(prev?.urls || {}));
  const added = [...sm.urls.keys()].filter((u) => !prevMap.has(u));
  const removed = [...prevMap.keys()].filter((u) => !sm.urls.has(u));
  const updated = [...sm.urls].filter(([u, v]) => prevMap.has(u) && prevMap.get(u) !== v.lastmod).map(([u]) => u);
  const changed = !prev || prev.fingerprint !== fingerprint;
  console.log(prev ? `Since ${prev.submittedAt || prev.checkedAt}: ${added.length} added, ${updated.length} updated, ${removed.length} removed.` : "No previous submission on record: this run counts as a change.");

  let submission = "Not needed: sitemap unchanged since the last submission";
  let indexnow = "skipped";
  const keyFile = resolve(ROOT, env("GSC_KEY_FILE", "automation/state/gsc-key.json"));
  const haveKey = existsSync(keyFile);
  const wantSubmit = (changed || force) && !dry;

  if (errors.length && wantSubmit) submission = `Not submitted: the sitemap has ${errors.length} error(s). Fix them first (see this report).`;
  else if (wantSubmit && !haveKey) submission = `Not submitted: no Search Console key at ${keyFile} (see automation/SEO-MONITORING.md).`;

  let token = null;
  if (haveKey) {
    try {
      ({ token } = await gscToken(keyFile, wantSubmit && !errors.length ? SCOPE_WRITE : SCOPE_READ));
    } catch (e) {
      submission = `Failed to sign in to Search Console: ${e.message}`;
    }
  }
  const smBase = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/sitemaps`;

  if (token && wantSubmit && !errors.length) {
    const before = Date.now();
    try {
      await gscCall(token, `${smBase}/${encodeURIComponent(FEED)}`, { method: "PUT" });
      const s = await gscCall(token, `${smBase}/${encodeURIComponent(FEED)}`);
      const ok = s.lastSubmitted && Date.parse(s.lastSubmitted) >= before - 120000;
      submission = ok ? `Confirmed: Search Console shows ${FEED} submitted at ${s.lastSubmitted}` : `Sent, but NOT confirmed: Search Console still shows lastSubmitted ${s.lastSubmitted || "(none)"}`;
      if (ok) writeJson(STATE_FILE, { fingerprint, submittedAt: new Date().toISOString(), urls: Object.fromEntries([...sm.urls].map(([u, v]) => [u, v.lastmod])) });
    } catch (e) {
      submission = `Failed: ${e.message}${e.status === 403 ? " (give the service account Full permission in Search Console → Settings → Users and permissions)" : ""}`;
    }
  } else if (dry) submission = changed || force ? "Dry run: would submit" : "Dry run: nothing to submit";

  if (!dry && (changed || force) && !errors.length) indexnow = await indexNow(prev ? [...added, ...updated] : [...sm.urls.keys()]);

  // Search Console's own view of the submitted sitemaps.
  const gscRows = [];
  if (token) {
    try {
      const list = await gscCall(token, smBase);
      for (const s of list.sitemap || [])
        gscRows.push({
          sitemap: s.path,
          type: s.isSitemapsIndex ? "index" : "sitemap",
          last_submitted: s.lastSubmitted || "",
          last_read_by_google: s.lastDownloaded || "",
          pending: s.isPending ? "yes" : "no",
          errors: s.errors || 0,
          warnings: s.warnings || 0,
          urls_submitted: (s.contents || []).reduce((a, c) => a + Number(c.submitted || 0), 0),
        });
      if (!gscRows.some((r) => r.sitemap === FEED)) console.log(`  warning: ${FEED} is not submitted in Search Console yet.`);
    } catch (e) {
      gscRows.push({ sitemap: `(could not read Search Console sitemaps: ${e.message})` });
    }
  }

  const rows = [
    { section: "Run", item: "Date", value: date },
    { section: "Run", item: "Sitemap", value: FEED },
    { section: "Run", item: "Sitemap files", value: sm.files.length },
    { section: "Run", item: "URLs listed", value: sm.urls.size },
    { section: "Run", item: "Changed since last submission", value: changed ? "yes" : "no" },
    { section: "Run", item: "Added / updated / removed", value: `${added.length} / ${updated.length} / ${removed.length}` },
    { section: "Run", item: "Search Console submission", value: submission },
    { section: "Run", item: "IndexNow", value: indexnow },
    ...sm.files.map((f) => ({ section: "Sitemap file", item: f.url, value: `HTTP ${f.status}, ${f.count} entries` })),
    ...sm.problems.map((p) => ({ section: `Validation ${p.severity}`, item: p.file, value: `${p.issue}. Fix: ${p.fix}` })),
    ...gscRows.map((g) => ({ section: "Search Console", item: g.sitemap, value: g.last_read_by_google !== undefined ? `last read ${g.last_read_by_google || "never"}; ${g.errors} errors, ${g.warnings} warnings; ${g.urls_submitted} URLs submitted${g.pending === "yes" ? "; pending" : ""}` : "" })),
    ...added.map((u) => ({ section: "Added", item: u, value: "" })),
    ...updated.map((u) => ({ section: "Updated", item: u, value: sm.urls.get(u).lastmod })),
    ...removed.map((u) => ({ section: "Removed", item: u, value: "" })),
  ];
  const out = join(REPORT_DIR, "indexing", `sitemap-${date}.csv`);
  writeText(out, csv(rows, ["section", "item", "value"]));
  writeJson(join(STATE_DIR, "sitemap-latest.json"), { date, feed: FEED, files: sm.files, urlCount: sm.urls.size, problems: sm.problems, changed, added: added.length, updated: updated.length, removed: removed.length, submission, indexnow, gsc: gscRows });

  console.log(`Search Console: ${submission}`);
  console.log(`IndexNow: ${indexnow}`);
  for (const g of gscRows) if (g.errors || g.warnings) console.log(`  Search Console reports ${g.errors} error(s), ${g.warnings} warning(s) for ${g.sitemap}`);
  console.log(`Report: ${out}`);
  process.exit(errors.length || /^Failed/.test(submission) ? 1 : 0);
}

main().catch((e) => {
  console.error("error:", e.message);
  process.exit(1);
});
