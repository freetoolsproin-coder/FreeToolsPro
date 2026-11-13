// Daily Google Search Console indexing monitor for freetoolspro.in. Read-only: it never changes the
// website, its files or its sitemap. It only writes reports to automation/reports/indexing/.
//
// 1. Reads every URL from the live sitemap index (/sitemap.xml and the sitemaps it lists).
// 2. Inspects each URL with the Search Console URL Inspection API and sorts it into a category
//    (Indexed, Crawled – currently not indexed, Discovered – currently not indexed, noindex,
//    robots.txt, duplicate canonical, server error, other).
// 3. Fetches every page itself, as Googlebot would get it: HTTP status, X-Robots-Tag, meta robots,
//    canonical, robots.txt rules, title, meta description, main-content word count, near-duplicate
//    text, internal links pointing at the page, and sitemap inclusion.
// 4. Writes specific fixes for every problem, a priority for every page, and the list of URLs worth a
//    manual "Request indexing" in Search Console (the API cannot request indexing for normal pages,
//    and Google's Indexing API is only for job-posting and livestream pages, so it is not used).
// 5. Compares with the previous run and lists every URL whose status changed.
//
//   node scripts/automation/gsc-index-monitor.mjs                     daily run
//   node scripts/automation/gsc-index-monitor.mjs --limit 20          inspect only the first 20 URLs (testing)
//   node scripts/automation/gsc-index-monitor.mjs --submit-sitemap    also resubmit /sitemap.xml (only with your approval;
//                                                                     needs Full permission for the service account)
//
// Settings in .env: GSC_KEY_FILE, GSC_SITE, INDEX_SITE_URL (default https://freetoolspro.in).
// Output (all CSV, opens in Excel): indexing-<date>.csv (every URL), -summary.csv, -fixes.csv,
// -manual-requests.csv, -changes.csv. History for comparisons: automation/state/indexing/<date>.json.
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { ROOT, STATE_DIR, REPORT_DIR, env, flag, option, readJson, writeJson, writeText, today } from "./lib/env.mjs";
import { gscToken, gscCall, SCOPE_READ, SCOPE_WRITE } from "./lib/gsc.mjs";

const SITE_URL = env("INDEX_SITE_URL", "https://freetoolspro.in").replace(/\/$/, "");
const HOST = new URL(SITE_URL).host;
const GSC_SITE = env("GSC_SITE", `sc-domain:${HOST}`);
const OUT_DIR = join(REPORT_DIR, "indexing");
const HISTORY_DIR = join(STATE_DIR, "indexing");
const LIMIT = Number(option("limit", "0")) || Infinity;
const UA = "Mozilla/5.0 (compatible; FreeToolsPro-IndexMonitor/1.0; +https://freetoolspro.in)";
const THIN_WORDS = 300; // main-content words below which a page counts as thin
const NEAR_DUP = 0.6; // share of 5-word phrases two pages have in common to count as near-duplicates

const CATEGORIES = [
  "Indexed",
  "Crawled – currently not indexed",
  "Discovered – currently not indexed",
  "Excluded by noindex",
  "Blocked by robots.txt",
  "Duplicate without user-selected canonical",
  "Server errors",
  "Other indexing issues",
];

// ------------------------------------------------------------------ helpers

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k], k);
      }
    })
  );
  return out;
}

const decode = (s) => String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i")) || tag.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, "i")) || [])[1];
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, "gi"))].map((m) => m[0]);
const metaContent = (html, key, val) => {
  const t = tags(html, "meta").find((m) => (attr(m, key) || "").toLowerCase() === val);
  return t ? decode(attr(t, "content") || "") : null;
};

/** One spelling per page: absolute, no query or fragment, no trailing slash (except the home page). */
function normUrl(href, base = SITE_URL) {
  try {
    const u = new URL(href, base + "/");
    if (u.host !== HOST) return null;
    let p = u.pathname.replace(/\/+$/, "") || "/";
    return `${u.protocol}//${u.host}${p === "/" ? "/" : p}`;
  } catch {
    return null;
  }
}

function csv(rows, cols) {
  const cell = (v) => {
    const s = v === null || v === undefined ? "" : Array.isArray(v) ? v.join(" | ") : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // The byte-order mark makes Excel open the file as UTF-8 (₹, – and other characters display correctly).
  return "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n") + "\r\n";
}

// ------------------------------------------------------------------ sitemap and robots.txt

async function sitemapUrls() {
  const get = async (u) => {
    const r = await fetch(u, { headers: { "user-agent": UA } });
    if (!r.ok) throw new Error(`${u} answered HTTP ${r.status}`);
    return r.text();
  };
  const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decode(m[1]));
  const root = `${SITE_URL}/sitemap.xml`;
  const xml = await get(root);
  const urls = new Map(); // url -> sitemap file it is listed in
  const files = /<sitemapindex/i.test(xml) ? locs(xml) : [root];
  for (const f of files) for (const u of f === root ? locs(xml) : locs(await get(f))) if (!urls.has(u)) urls.set(u, f.replace(SITE_URL, ""));
  return { urls, files };
}

/** robots.txt rules for Googlebot (its own group if there is one, otherwise *). */
async function robotsRules() {
  let text = "";
  try {
    const r = await fetch(`${SITE_URL}/robots.txt`, { headers: { "user-agent": UA } });
    text = r.ok ? await r.text() : "";
  } catch {}
  const groups = [];
  let cur = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const k = m[1].toLowerCase();
    if (k === "user-agent") {
      if (!lastWasAgent) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(m[2].toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (cur && (k === "allow" || k === "disallow")) cur.rules.push({ allow: k === "allow", path: m[2] });
    }
  }
  const pick = groups.find((g) => g.agents.includes("googlebot")) || groups.find((g) => g.agents.includes("*"));
  return pick ? pick.rules : [];
}

function robotsAllowed(rules, url) {
  const path = new URL(url).pathname + new URL(url).search;
  let best = null;
  for (const r of rules) {
    if (!r.path) continue; // "Disallow:" with no path allows everything
    const re = new RegExp("^" + r.path.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    if (!re.test(path)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  return best ? { allowed: best.allow, rule: `${best.allow ? "Allow" : "Disallow"}: ${best.path}` } : { allowed: true, rule: "" };
}

// ------------------------------------------------------------------ live page checks

async function fetchPage(url) {
  try {
    const r = await fetch(url, { redirect: "manual", headers: { "user-agent": UA } });
    const html = r.status === 200 ? await r.text() : "";
    return { status: r.status, location: r.headers.get("location") || "", xRobots: r.headers.get("x-robots-tag") || "", html };
  } catch (e) {
    return { status: 0, location: "", xRobots: "", html: "", error: e.message };
  }
}

function analyse(url, page) {
  const h = page.html;
  const head = h.slice(0, h.search(/<\/head>/i) > 0 ? h.search(/<\/head>/i) : h.length);
  const canonTag = tags(head, "link").find((t) => (attr(t, "rel") || "").toLowerCase() === "canonical");
  const canonical = canonTag ? decode(attr(canonTag, "href") || "") : "";
  const main = (h.match(/<main\b[\s\S]*?<\/main>/i) || [h.replace(/<header\b[\s\S]*?<\/header>|<footer\b[\s\S]*?<\/footer>/gi, "")])[0];
  const body = main.replace(/<(script|style|noscript|svg|aside|nav|template)\b[\s\S]*?<\/\1>/gi, " ");
  const text = decode(body.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ") : [];
  const linksIn = (s) => [...new Set(tags(s, "a").map((t) => attr(t, "href")).filter(Boolean).map((x) => normUrl(decode(x), url)).filter(Boolean))].filter((u) => u !== url);
  const shingles = new Set();
  const lw = words.map((w) => w.toLowerCase().replace(/[^a-z0-9₹%.]/g, "")).filter(Boolean);
  for (let i = 0; i + 5 <= lw.length; i++) shingles.add(lw.slice(i, i + 5).join(" "));
  return {
    title: decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "").trim(),
    description: metaContent(head, "name", "description") ?? "",
    metaRobots: [metaContent(head, "name", "robots"), metaContent(head, "name", "googlebot")].filter(Boolean).join(", "),
    canonical,
    h1: (h.match(/<h1\b/gi) || []).length,
    wordCount: words.length,
    shingles,
    linksAll: linksIn(h),
    linksMain: linksIn(main.replace(/<(nav|aside)\b[\s\S]*?<\/\1>/gi, " ")),
  };
}

const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [s, l] = a.size < b.size ? [a, b] : [b, a];
  for (const x of s) if (l.has(x)) inter++;
  return inter / (a.size + b.size - inter);
};

// ------------------------------------------------------------------ URL Inspection

async function inspect(token, url) {
  try {
    const j = await gscCall(token, "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", { method: "POST", body: { inspectionUrl: url, siteUrl: GSC_SITE, languageCode: "en-US" } });
    return j.inspectionResult?.indexStatusResult || {};
  } catch (e) {
    return { error: e.message };
  }
}

function categorize(ix, page) {
  const cs = (ix.coverageState || "").toLowerCase();
  if (ix.error) return "Other indexing issues";
  if (ix.verdict === "PASS" || (/indexed/.test(cs) && !/not indexed/.test(cs))) return "Indexed";
  if (/noindex/.test(cs) || ["BLOCKED_BY_META_TAG", "BLOCKED_BY_HTTP_HEADER"].includes(ix.indexingState)) return "Excluded by noindex";
  if (/robots\.txt/.test(cs) || ix.robotsTxtState === "DISALLOWED" || ix.pageFetchState === "BLOCKED_ROBOTS_TXT") return "Blocked by robots.txt";
  if (/server error|5xx/.test(cs) || ix.pageFetchState === "SERVER_ERROR") return "Server errors";
  if (/duplicate without user-selected canonical/.test(cs)) return "Duplicate without user-selected canonical";
  if (/crawled - currently not indexed|crawled – currently not indexed/.test(cs)) return "Crawled – currently not indexed";
  if (/discovered - currently not indexed|discovered – currently not indexed/.test(cs)) return "Discovered – currently not indexed";
  return "Other indexing issues";
}

// ------------------------------------------------------------------ priority

let catalog = null;
try {
  catalog = await import("../../src/data/catalog.js");
} catch {}
function pageInfo(url) {
  const path = new URL(url).pathname.replace(/\/+$/, "") || "/";
  const tool = catalog?.toolByPath?.[path];
  const hub = catalog?.CATEGORIES?.find((c) => c.path === path);
  if (path === "/") return { type: "Home", priority: "High", rank: 0 };
  if (hub) return { type: "Category hub", priority: "High", rank: 1 };
  if (tool) return { type: "Tool", priority: tool.popular || tool.rank <= 30 ? "High" : tool.rank <= 90 ? "Medium" : "Low", rank: 2 + tool.rank };
  if (/^\/(tools|ebooks)$/.test(path)) return { type: "Index page", priority: "Medium", rank: 500 };
  if (/privacy|terms|cookie|disclaimer|contact|about|methodology/.test(path)) return { type: "Policy / info", priority: "Low", rank: 900 };
  return { type: "Other", priority: "Medium", rank: 700 };
}

// ------------------------------------------------------------------ issues and fixes

function diagnose(r) {
  const pairs = []; // { issue, fix } – fix may be empty for issues that are information only
  const add = (issue, fix = "") => pairs.push({ issue, fix });
  const ix = r.ix;
  const indexed = r.category === "Indexed";

  // Live checks (apply to every page)
  if (r.page.status === 0) add(`Could not fetch the page (${r.page.error})`, "Check that the server is up and reachable; Google will report a server error if it gets the same result.");
  else if (r.page.status >= 300 && r.page.status < 400) add(`Redirects (HTTP ${r.page.status} → ${r.page.location})`, `Replace this URL in the sitemap with its final destination ${normUrl(r.page.location, r.url) || r.page.location}; sitemaps must list only URLs that answer 200.`);
  else if (r.page.status >= 500) add(`Server error (HTTP ${r.page.status})`, "Check the nginx and Node server logs for this path and fix the error; then use Request indexing once it answers 200.");
  else if (r.page.status === 404 || r.page.status === 410) add(`Gone (HTTP ${r.page.status}) but listed in the sitemap`, "Remove the URL from the sitemap, or restore the page if it should exist.");
  else if (r.page.status !== 200) add(`HTTP ${r.page.status}`, "Make the page answer 200, or remove it from the sitemap.");

  if (r.page.status === 200) {
    const a = r.a;
    if (/noindex/i.test(a.metaRobots)) add(`meta robots: "${a.metaRobots}"`, "Remove noindex from the page's <meta name=\"robots\"> (Base.astro, noindex prop) if it should be indexed; otherwise remove it from the sitemap.");
    if (/noindex/i.test(r.page.xRobots)) add(`X-Robots-Tag header: "${r.page.xRobots}"`, "Remove the noindex X-Robots-Tag for this path in deploy/nginx.conf, or remove the URL from the sitemap.");
    if (!r.robots.allowed) add(`Blocked by robots.txt (${r.robots.rule})`, `Change the rule "${r.robots.rule}" in src/pages/robots.txt.js so Googlebot may crawl this URL.`);
    if (!a.canonical) add("No canonical tag", "Add <link rel=\"canonical\"> pointing to the page's own URL (Base.astro does this for every page that passes a path).");
    else if (normUrl(a.canonical) !== r.url) add(`Canonical points elsewhere (${a.canonical})`, `Either make the canonical self-referencing (${r.url}) or drop this URL from the sitemap; sitemap URLs should be their own canonical.`);
    if (!a.title) add("No <title>", "Add a unique, descriptive title.");
    else if (a.title.length > 60) add(`Title is ${a.title.length} characters`, "Shorten the title to 60 characters or less with the main search phrase first.");
    else if (a.title.length < 20) add(`Title is only ${a.title.length} characters`, "Write a fuller title that names what the page does and the main search phrase.");
    if (!a.description) add("No meta description", "Add a 120–158 character meta description.");
    else if (a.description.length > 160 || a.description.length < 70) add(`Meta description is ${a.description.length} characters`, "Rewrite the description to 120–158 characters.");
    if (r.dupTitle.length) add(`Same title as ${r.dupTitle.join(", ")}`, "Give each page its own title.");
    if (r.dupDesc.length) add(`Same meta description as ${r.dupDesc.join(", ")}`, "Give each page its own meta description.");
    if (a.h1 !== 1) add(`${a.h1} <h1> elements`, "Use exactly one <h1> per page.");
    if (a.wordCount < THIN_WORDS && !/Policy/.test(r.info.type)) add(`Thin main content (${a.wordCount} words)`, `Add useful, original text to the page body (how it works, a worked example, FAQs, limitations): aim for well over ${THIN_WORDS} words of content that answers what searchers ask.`);
    if (r.similar && r.similar.score >= NEAR_DUP) add(`Near-duplicate of ${r.similar.url} (${Math.round(r.similar.score * 100)}% shared text)`, `Make the page clearly different from ${r.similar.url}: its own intro, worked example and FAQs; or merge the two and 301 the weaker URL.`);
    if (r.info.type === "Home") {
      // The home page is reached from every logo and menu; inbound links are not a concern.
    } else if (r.inboundMain === 0) add(`No links to this page from other pages' main content (${r.inboundAll} from menus/footers)`, "Link to it from its category hub, the home page or related tool pages with descriptive anchor text.");
    else if (r.inboundMain < 3 && !indexed) add(`Only ${r.inboundMain} contextual internal link(s) point here`, "Add more links from related tools and the category hub.");
  }

  // What Google itself reports
  if (ix.error) add(`URL Inspection failed: ${ix.error}`, "Run again later; if it keeps failing, check the service account's access to the property.");
  if (ix.googleCanonical && ix.userCanonical && normUrl(ix.googleCanonical) !== normUrl(ix.userCanonical))
    add(`Google chose a different canonical (${ix.googleCanonical})`, `Google treats this page as a duplicate of ${ix.googleCanonical}. Make the content clearly distinct, link to this URL internally, and check that http, www and trailing-slash versions 301 to ${r.url} (deploy/nginx.conf).`);
  if (ix.pageFetchState === "SOFT_404") add("Google sees a soft 404", "The page looks empty or like an error page to Google. Make sure real content is in the HTML without JavaScript, or return a real 404/410.");
  if (!indexed && !ix.error) {
    if (r.category === "Crawled – currently not indexed")
      add("Crawled – currently not indexed", "Google crawled the page but chose not to index it, which is a quality signal. Improve and differentiate the content first (see the issues above), add internal links, then request indexing once.");
    if (r.category === "Discovered – currently not indexed")
      add("Discovered – currently not indexed", "Google knows the URL but has not crawled it yet. Link to it from the home page or its hub, keep its sitemap <lastmod> accurate, and request indexing; this usually clears as Google's crawl of the site grows.");
    if (/unknown to google/i.test(ix.coverageState || "")) add("URL is unknown to Google", "Google has not seen this URL yet. It is in the sitemap; add internal links to it and request indexing.");
    if (r.category === "Duplicate without user-selected canonical") add("Duplicate without user-selected canonical", `Add a self-referencing canonical and make the content distinct from the page Google grouped it with${ix.googleCanonical ? ` (${ix.googleCanonical})` : ""}.`);
    if (!ix.sitemap?.length) add("Search Console does not list this URL under any submitted sitemap", "Check that https://freetoolspro.in/sitemap.xml is submitted under Sitemaps in Search Console and reads without errors (see the summary).");
    if (!ix.referringUrls?.length) add("Google reports no referring pages", "");
  }
  return { pairs, issues: pairs.map((p) => p.issue), fixes: [...new Set(pairs.map((p) => p.fix).filter(Boolean))] };
}

// ------------------------------------------------------------------ main

async function main() {
  const keyFile = env("GSC_KEY_FILE");
  if (!keyFile) throw new Error("GSC_KEY_FILE is not set in .env (see automation/INDEXING.md).");
  const submit = flag("submit-sitemap");
  const { token, email } = await gscToken(resolve(ROOT, keyFile), submit ? SCOPE_WRITE : SCOPE_READ);
  const date = today();
  const started = Date.now();
  console.log(`Property ${GSC_SITE}, service account ${email}`);

  const { urls: listed, files } = await sitemapUrls();
  const all = [...listed.keys()].map((u) => normUrl(u) || u);
  const urls = all.slice(0, LIMIT);
  console.log(`Sitemap: ${all.length} URLs in ${files.length} sitemap file(s). Inspecting ${urls.length}.`);

  // Fetch every sitemap page (also needed for duplicate and internal-link checks).
  const rules = await robotsRules();
  const pages = await pool(all, 6, async (u) => ({ url: u, page: await fetchPage(u) }));
  const byUrl = new Map(pages.map((p) => [p.url, { ...p, a: p.page.status === 200 ? analyse(p.url, p.page) : null }]));
  const inboundMain = new Map();
  const inboundAll = new Map();
  for (const p of byUrl.values())
    if (p.a) {
      for (const l of p.a.linksMain) inboundMain.set(l, (inboundMain.get(l) || 0) + 1);
      for (const l of p.a.linksAll) inboundAll.set(l, (inboundAll.get(l) || 0) + 1);
    }
  const titles = new Map();
  const descs = new Map();
  for (const p of byUrl.values())
    if (p.a) {
      if (p.a.title) titles.set(p.a.title, [...(titles.get(p.a.title) || []), p.url]);
      if (p.a.description) descs.set(p.a.description, [...(descs.get(p.a.description) || []), p.url]);
    }

  // URL Inspection: 2,000 calls per day and 600 per minute per property; 3 at a time stays far below.
  let done = 0;
  const inspections = await pool(urls, 3, async (u) => {
    const r = await inspect(token, u);
    if (++done % 25 === 0) console.log(`  inspected ${done}/${urls.length}`);
    await sleep(150);
    return r;
  });

  const rows = urls.map((url, i) => {
    const p = byUrl.get(url);
    const ix = inspections[i];
    const info = pageInfo(url);
    let similar = null;
    if (p.a)
      for (const q of byUrl.values())
        if (q.url !== url && q.a) {
          const s = jaccard(p.a.shingles, q.a.shingles);
          if (!similar || s > similar.score) similar = { url: q.url, score: s };
        }
    const r = {
      url,
      info,
      ix,
      page: p.page,
      a: p.a,
      category: categorize(ix, p.page),
      robots: robotsAllowed(rules, url),
      similar,
      inboundMain: inboundMain.get(url) || 0,
      inboundAll: inboundAll.get(url) || 0,
      dupTitle: p.a?.title ? (titles.get(p.a.title) || []).filter((x) => x !== url) : [],
      dupDesc: p.a?.description ? (descs.get(p.a.description) || []).filter((x) => x !== url) : [],
    };
    Object.assign(r, diagnose(r));
    const cleanForRequest =
      r.category !== "Indexed" &&
      !ix.error &&
      r.page.status === 200 &&
      r.robots.allowed &&
      !/noindex/i.test(`${r.a?.metaRobots} ${r.page.xRobots}`) &&
      r.a?.canonical &&
      normUrl(r.a.canonical) === url;
    const blockedByQuality = r.issues.some((x) => /^Thin main content|^Near-duplicate/.test(x));
    r.manual = cleanForRequest ? (blockedByQuality ? "After fixing content" : "Yes") : "No";
    return r;
  });

  // ---------------------------------------------------------------- comparison with the previous run
  let prev = null;
  try {
    const files = readdirSync(HISTORY_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f < `${date}.json`).sort();
    if (files.length) prev = readJson(join(HISTORY_DIR, files.at(-1)), null);
  } catch {}
  const changes = [];
  for (const r of rows) {
    const was = prev?.urls?.[r.url];
    if (!prev) continue;
    if (!was) changes.push({ url: r.url, previous: "(not in previous run)", current: r.category, change: "New URL" });
    else if (was.category !== r.category)
      changes.push({ url: r.url, previous: was.category, current: r.category, change: r.category === "Indexed" ? "Newly indexed" : was.category === "Indexed" ? "Dropped from index" : "Status changed" });
  }
  if (prev) for (const u of Object.keys(prev.urls || {})) if (!rows.find((r) => r.url === u) && (LIMIT === Infinity)) changes.push({ url: u, previous: prev.urls[u].category, current: "(no longer in sitemap)", change: "Removed from sitemap" });

  // ---------------------------------------------------------------- sitemap status (and optional resubmission)
  const sitemapRows = [];
  const smBase = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/sitemaps`;
  let submission = "Not requested (run with --submit-sitemap after you approve it)";
  if (submit) {
    const feed = `${SITE_URL}/sitemap.xml`;
    const before = Date.now();
    try {
      await gscCall(token, `${smBase}/${encodeURIComponent(feed)}`, { method: "PUT" });
      const s = await gscCall(token, `${smBase}/${encodeURIComponent(feed)}`);
      const confirmed = s.lastSubmitted && Date.parse(s.lastSubmitted) >= before - 120000;
      submission = confirmed ? `Confirmed: Search Console shows ${feed} submitted at ${s.lastSubmitted}` : `Sent, but NOT confirmed: Search Console still shows lastSubmitted ${s.lastSubmitted || "(none)"}`;
    } catch (e) {
      submission = `Failed: ${e.message}${e.status === 403 ? " (the service account needs Full permission in Search Console to submit sitemaps)" : ""}`;
    }
  }
  try {
    const list = await gscCall(token, smBase);
    for (const s of list.sitemap || [])
      sitemapRows.push({ sitemap: s.path, lastSubmitted: s.lastSubmitted || "", lastDownloaded: s.lastDownloaded || "", pending: s.isPending ? "yes" : "no", errors: s.errors || 0, warnings: s.warnings || 0 });
  } catch (e) {
    sitemapRows.push({ sitemap: `(could not read sitemaps: ${e.message})` });
  }

  // ---------------------------------------------------------------- write reports
  const count = (rs, c) => rs.filter((r) => r.category === c).length;
  const indexed = count(rows, "Indexed");
  const prevCount = (c) => (prev ? Object.values(prev.urls).filter((v) => c === null || v.category === c).length : "");
  const prevIndexed = prev ? prevCount("Indexed") : "";
  const delta = (now, was) => (was === "" ? "" : now - was > 0 ? `+${now - was}` : `${now - was}`);
  const summary = [
    { metric: "Report date", value: date, previous: prev?.date || "", change: "" },
    { metric: "Property", value: GSC_SITE, previous: "", change: "" },
    { metric: "URLs in sitemap", value: all.length, previous: prev?.sitemapCount ?? "", change: delta(all.length, prev?.sitemapCount ?? "") },
    { metric: "Total URLs inspected", value: rows.length, previous: prev ? prevCount(null) : "", change: delta(rows.length, prev ? prevCount(null) : "") },
    { metric: "Indexed URLs", value: indexed, previous: prevIndexed, change: delta(indexed, prevIndexed) },
    { metric: "Non-indexed URLs", value: rows.length - indexed, previous: prev ? prevCount(null) - prevIndexed : "", change: delta(rows.length - indexed, prev ? prevCount(null) - prevIndexed : "") },
    { metric: "Index coverage", value: rows.length ? `${((indexed / rows.length) * 100).toFixed(1)}%` : "", previous: prev && prevCount(null) ? `${((prevIndexed / prevCount(null)) * 100).toFixed(1)}%` : "", change: "" },
    ...CATEGORIES.slice(1).map((c) => ({ metric: `Category: ${c}`, value: count(rows, c), previous: prev ? prevCount(c) : "", change: delta(count(rows, c), prev ? prevCount(c) : "") })),
    { metric: "Newly indexed since previous run", value: changes.filter((c) => c.change === "Newly indexed").length, previous: "", change: "" },
    { metric: "Dropped from index since previous run", value: changes.filter((c) => c.change === "Dropped from index").length, previous: "", change: "" },
    { metric: "URLs ready for a manual indexing request", value: rows.filter((r) => r.manual === "Yes").length, previous: "", change: "" },
    { metric: "URLs to request after fixing content", value: rows.filter((r) => r.manual === "After fixing content").length, previous: "", change: "" },
    { metric: "URLs where inspection failed", value: rows.filter((r) => r.ix.error).length, previous: "", change: "" },
    { metric: "Sitemap submission this run", value: submission, previous: "", change: "" },
    ...sitemapRows.map((s) => ({ metric: `Sitemap in Search Console: ${s.sitemap}`, value: s.lastDownloaded ? `last read by Google ${s.lastDownloaded}; ${s.errors} errors, ${s.warnings} warnings${s.pending === "yes" ? "; pending" : ""}` : "", previous: "", change: "" })),
    { metric: "Run time (seconds)", value: Math.round((Date.now() - started) / 1000), previous: "", change: "" },
  ];

  const inspectLink = (u) => `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(GSC_SITE)}&id=${encodeURIComponent(u)}`;
  const prioOrder = { High: 0, Medium: 1, Low: 2 };
  const sorted = [...rows].sort((a, b) => (a.category === "Indexed") - (b.category === "Indexed") || prioOrder[a.info.priority] - prioOrder[b.info.priority] || a.info.rank - b.info.rank);
  const full = sorted.map((r) => ({
    url: r.url,
    page_type: r.info.type,
    priority: r.info.priority,
    category: r.category,
    gsc_coverage_state: r.ix.coverageState || r.ix.error || "",
    gsc_verdict: r.ix.verdict || "",
    gsc_indexing_state: r.ix.indexingState || "",
    gsc_robots_state: r.ix.robotsTxtState || "",
    gsc_page_fetch: r.ix.pageFetchState || "",
    gsc_last_crawl: r.ix.lastCrawlTime || "",
    gsc_crawled_as: r.ix.crawledAs || "",
    google_canonical: r.ix.googleCanonical || "",
    user_canonical: r.ix.userCanonical || "",
    gsc_sitemaps: r.ix.sitemap || [],
    gsc_referring_urls: (r.ix.referringUrls || []).length,
    in_sitemap_file: listed.get([...listed.keys()].find((k) => (normUrl(k) || k) === r.url)) || "",
    http_status: r.page.status || r.page.error,
    redirect_to: r.page.location,
    x_robots_tag: r.page.xRobots,
    meta_robots: r.a?.metaRobots || "",
    robots_txt: r.robots.allowed ? "Allowed" : `Blocked (${r.robots.rule})`,
    canonical_tag: r.a?.canonical || "",
    canonical_self: r.a ? (normUrl(r.a.canonical) === r.url ? "Yes" : "No") : "",
    title: r.a?.title || "",
    title_length: r.a?.title?.length ?? "",
    meta_description: r.a?.description || "",
    description_length: r.a?.description?.length ?? "",
    main_content_words: r.a?.wordCount ?? "",
    most_similar_page: r.similar?.url || "",
    similarity_pct: r.similar ? Math.round(r.similar.score * 100) : "",
    internal_links_in_content: r.inboundMain,
    internal_links_total: r.inboundAll,
    issues: r.issues,
    recommended_fixes: r.fixes,
    manual_indexing_request: r.manual,
    inspect_in_search_console: inspectLink(r.url),
  }));

  const fixRows = sorted.flatMap((r) => r.pairs.filter((p) => p.fix).map((p) => ({ priority: r.info.priority, url: r.url, category: r.category, issue: p.issue, fix: p.fix })));
  const manual = sorted
    .filter((r) => r.manual !== "No")
    .map((r) => ({ priority: r.info.priority, url: r.url, category: r.category, when: r.manual === "Yes" ? "Now" : "After fixing the content issues listed", open_url_inspection: inspectLink(r.url) }));

  const base = join(OUT_DIR, `indexing-${date}`);
  writeText(`${base}.csv`, csv(full, Object.keys(full[0] || { url: "" })));
  writeText(`${base}-summary.csv`, csv(summary, ["metric", "value", "previous", "change"]));
  writeText(`${base}-fixes.csv`, csv(fixRows, ["priority", "url", "category", "issue", "fix"]));
  writeText(`${base}-manual-requests.csv`, csv(manual, ["priority", "url", "category", "when", "open_url_inspection"]));
  writeText(`${base}-changes.csv`, csv(changes, ["url", "previous", "current", "change"]));
  // A partial (--limit) run is not saved as history, so it cannot distort tomorrow's comparison.
  if (LIMIT === Infinity) writeJson(join(HISTORY_DIR, `${date}.json`), { date, sitemapCount: all.length, urls: Object.fromEntries(rows.filter((r) => !r.ix.error).map((r) => [r.url, { category: r.category, coverageState: r.ix.coverageState || "", lastCrawl: r.ix.lastCrawlTime || "" }])) });

  console.log(`\nInspected ${rows.length}: ${indexed} indexed, ${rows.length - indexed} not indexed.`);
  for (const c of CATEGORIES.slice(1)) if (count(rows, c)) console.log(`  ${c}: ${count(rows, c)}`);
  if (prev) console.log(`Since ${prev.date}: ${changes.filter((c) => c.change === "Newly indexed").length} newly indexed, ${changes.filter((c) => c.change === "Dropped from index").length} dropped, ${changes.length} change(s) in all.`);
  console.log(`Manual indexing requests: ${manual.filter((m) => m.when === "Now").length} ready now, ${manual.filter((m) => m.when !== "Now").length} after content fixes.`);
  console.log(`Sitemap submission: ${submission}`);
  console.log(`Reports: ${base}*.csv`);
}

main().catch((e) => {
  console.error("error:", e.message);
  process.exit(1);
});
