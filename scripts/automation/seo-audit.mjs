// Continuous technical SEO / AEO audit for freetoolspro.in. Read-only: it never changes the site.
//
// Crawls every sitemap URL as raw HTML (what a crawler gets before JavaScript), follows every internal
// link, and checks:
//   • robots.txt and sitemaps: reachable, valid XML, sitemaps.org rules, Sitemap: line, no sitemap URL blocked
//   • HTTP status and redirects: non-200 sitemap URLs, redirect chains and loops, links that point at redirects
//   • broken links: internal links, images and share images (and external links with --external)
//   • metadata: title, description, canonical, robots directives, lang, viewport, H1, Open Graph, Twitter Card
//   • duplicates: titles and descriptions shared by more than one page
//   • images: missing alt, file-name alt text, missing width/height (layout shift)
//   • structured data: JSON-LD parses, required properties per type, the types each page type should have
//   • AEO: FAQ coverage, question-style headings, a short direct answer near the top, thin content
//   • internal linking: orphan pages, pages with few contextual links, indexable pages missing from the
//     sitemap, and concrete "link from page A to page B" recommendations
// It also compares with the previous run, so the report shows new and resolved issues.
//
//   node scripts/automation/seo-audit.mjs                 audit the live site
//   node scripts/automation/seo-audit.mjs --dist          audit the built dist/ folder (before deploying)
//   node scripts/automation/seo-audit.mjs --external      also check outbound links to other sites
//   node scripts/automation/seo-audit.mjs --strict        exit 1 when there are errors (for CI / pre-deploy)
//   node scripts/automation/seo-audit.mjs --limit 20      first 20 sitemap URLs only (testing; not saved as history)
//
// Output: automation/reports/audit/seo-audit-<date>-{issues,pages,broken-links,link-suggestions}.csv
// History: automation/state/audit/<mode>-<date>.json
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { STATE_DIR, REPORT_DIR, env, flag, option, readJson, writeJson, writeText, today } from "./lib/env.mjs";
import { makeSource, readSitemaps, parseRobots, robotsRulesFor, robotsAllowed, pool, tags, attr, hasAttr, metaContent, decode, stripTags, absUrl, jsonLd, typesOf, csv } from "./lib/crawl.mjs";

const SITE_URL = env("INDEX_SITE_URL", "https://freetoolspro.in").replace(/\/$/, "");
const DIST = flag("dist") ? option("dist", "dist") : null;
const EXTERNAL = flag("external");
const STRICT = flag("strict");
const LIMIT = Number(option("limit", "0")) || Infinity;
const CONCURRENCY = Number(env("AUDIT_CONCURRENCY", "8"));
const MIN_CONTEXT_LINKS = Number(env("AUDIT_MIN_CONTEXT_LINKS", "3"));
const THIN_WORDS = 300;
const MODE = DIST ? "dist" : "live";
const OUT_DIR = join(REPORT_DIR, "audit");
const HIST_DIR = join(STATE_DIR, "audit");

const src = makeSource({ siteUrl: SITE_URL, dist: DIST });
const issues = [];
/** severity: error (breaks indexing or rich results), warning (hurts rankings/CTR), notice (worth a look). */
const add = (url, severity, check, code, issue, fix, target = "") => issues.push({ severity, check, code, url, issue, fix, target });

let catalog = null;
try {
  catalog = await import("../../src/data/catalog.js");
} catch {}
function pageType(url) {
  const path = new URL(url).pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (catalog?.CATEGORIES?.some((c) => c.path === path)) return "hub";
  if (catalog?.toolByPath?.[path]) return "tool";
  if (/^\/(tools|ebooks)$/.test(path)) return "index";
  if (/privacy|terms|cookie|disclaimer|contact|about|methodology/.test(path)) return "info";
  return path.split("/").length > 2 ? "tool" : "other";
}

// ------------------------------------------------------------------ page analysis

const STOP = new Set(
  "a an and are as at be by for free from how in is it of on online or the to tool tools with your you what why when can does do india calculator calculators calculate converter generator freetoolspro use using get page pages year years month months lakh crore rs inr best easy quick fast instant browser no sign up signup".split(" ")
);
const tokens = (s) => String(s).toLowerCase().replace(/[^a-z0-9₹%]+/g, " ").split(" ").filter((w) => w.length > 2 && !STOP.has(w));
const QUESTION = /\?\s*$|^(what|how|why|when|which|who|where|is|are|can|does|do|should|will)\b/i;
const GENERIC_ANCHOR = /^(click here|here|read more|more|learn more|this|link|this page|go|details)$/i;

function analyse(url, r) {
  const h = r.body;
  const headEnd = h.search(/<\/head>/i);
  const head = headEnd > 0 ? h.slice(0, headEnd) : h;
  const mainMatch = h.match(/<main\b[\s\S]*?<\/main>/i);
  const main = mainMatch ? mainMatch[0] : h.replace(/<header\b[\s\S]*?<\/header>|<footer\b[\s\S]*?<\/footer>/gi, "");
  const content = main.replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ");
  const contentNoNav = content.replace(/<(nav|aside)\b[\s\S]*?<\/\1>/gi, " ");
  const text = stripTags(contentNoNav);
  const canonTags = tags(head, "link").filter((t) => (attr(t, "rel") || "").toLowerCase() === "canonical");
  const og = {};
  for (const t of tags(head, "meta")) {
    const p = (attr(t, "property") || attr(t, "name") || "").toLowerCase();
    if (/^(og|twitter):/.test(p) && !(p in og)) og[p] = decode(attr(t, "content") || "");
  }
  // Scripts, styles and templates can contain markup as text (e.g. a JSON search index), so skip them.
  const hc = h.replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, " ");
  const anchors = [];
  for (const m of hc.matchAll(/<a\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/a>/gi)) {
    const tag = `<a${m[1]}>`;
    const href = attr(tag, "href");
    const abs = absUrl(decode(href || ""), url);
    if (!abs) continue;
    const imgAlt = tags(m[2], "img").map((i) => attr(i, "alt") || "").join(" ");
    anchors.push({ href: abs, rawHref: href, text: stripTags(m[2]) || attr(tag, "aria-label") || attr(tag, "title") || imgAlt, rel: (attr(tag, "rel") || "").toLowerCase() });
  }
  const images = tags(hc, "img").map((t) => ({ src: absUrl(decode(attr(t, "src") || ""), url), rawSrc: attr(t, "src") || "", hasAlt: hasAttr(t, "alt"), alt: decode(attr(t, "alt") || ""), width: attr(t, "width"), height: attr(t, "height"), lazy: /lazy/i.test(attr(t, "loading") || "") }));
  const headings = [...content.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => stripTags(m[2]));
  const firstP = stripTags((contentNoNav.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || "");
  const ld = jsonLd(h);
  return {
    title: decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "").trim(),
    description: metaContent(head, "name", "description"),
    robots: [metaContent(head, "name", "robots"), metaContent(head, "name", "googlebot"), r.xRobots].filter(Boolean).join(", "),
    canonicals: canonTags.map((t) => decode(attr(t, "href") || "")),
    lang: attr((h.match(/<html\b[^>]*>/i) || [""])[0], "lang") || "",
    viewport: metaContent(head, "name", "viewport"),
    charset: /<meta[^>]+charset=/i.test(head),
    og,
    h1: [...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1])),
    headings,
    firstP,
    words: text ? text.split(" ").length : 0,
    anchors,
    images,
    ld,
    mainLinks: new Set(tags(contentNoNav, "a").map((t) => absUrl(decode(attr(t, "href") || ""), url)).filter(Boolean)),
    mixed:
      tags(h, "(?:img|script|iframe|source|video|audio|embed)").filter((t) => /\ssrc\s*=\s*["']http:\/\//i.test(t)).length +
      tags(h, "link").filter((t) => /\shref\s*=\s*["']http:\/\//i.test(t) && /stylesheet|preload|icon|manifest/i.test(attr(t, "rel") || "")).length,
  };
}

// ------------------------------------------------------------------ structured data rules

const appsWithoutRating = new Set();

const REQUIRED = {
  Organization: ["name", "url", "logo"],
  WebSite: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  WebApplication: ["name", "applicationCategory", "operatingSystem", "offers"],
  SoftwareApplication: ["name", "applicationCategory", "operatingSystem", "offers"],
  HowTo: ["name", "step"],
  ItemList: ["itemListElement"],
  CollectionPage: ["name", "url"],
  WebPage: ["name"],
  AboutPage: ["name"],
  ContactPage: ["name"],
  Person: ["name"],
  ImageObject: ["url"],
};

function checkSchema(url, type, a) {
  const { nodes, errors } = a.ld;
  for (const e of errors) add(url, "error", "Structured data", "jsonld-parse", `JSON-LD does not parse (${e})`, "Fix the JSON in the page's jsonld builder; Google ignores the whole block.");
  if (!nodes.length && type !== "other") add(url, "warning", "Structured data", "jsonld-none", "No structured data on the page", "Add WebPage and BreadcrumbList JSON-LD (src/lib/schema.js has builders).");
  const has = (t) => nodes.some((n) => typesOf(n).includes(t));
  for (const n of nodes) {
    for (const t of typesOf(n)) {
      for (const p of REQUIRED[t] || []) {
        const v = n[p];
        if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) {
          // Nodes that are only references ({"@id": ...}) are defined elsewhere on the page.
          if (Object.keys(n).every((k) => k.startsWith("@"))) continue;
          add(url, "error", "Structured data", `schema-${t}-${p}`, `${t} is missing required property "${p}"`, `Add "${p}" to the ${t} node.`);
        }
      }
    }
    if (typesOf(n).includes("FAQPage")) {
      for (const q of [].concat(n.mainEntity || [])) if (!q?.name || !q?.acceptedAnswer?.text) add(url, "error", "Structured data", "schema-faq-question", "An FAQPage question has no name or answer text", "Each Question needs name and acceptedAnswer.text.");
    }
    if (typesOf(n).includes("BreadcrumbList")) {
      const items = [].concat(n.itemListElement || []);
      const last = items[items.length - 1];
      const lastUrl = typeof last?.item === "string" ? last.item : last?.item?.["@id"];
      if (lastUrl && lastUrl.replace(/\/$/, "") !== url.replace(/\/$/, "")) add(url, "warning", "Structured data", "schema-breadcrumb-last", `Breadcrumb ends at ${lastUrl}, not this page`, "The last breadcrumb item should be the current page's URL.");
      items.forEach((it, i) => {
        if (it.position !== i + 1) add(url, "warning", "Structured data", "schema-breadcrumb-position", "Breadcrumb positions are not 1, 2, 3...", "Number ListItem positions from 1 in order.");
      });
    }
    for (const t of ["WebApplication", "SoftwareApplication"])
      if (typesOf(n).includes(t) && !n.aggregateRating && !n.review) appsWithoutRating.add(url);
  }
  if (type === "home") {
    if (!has("Organization")) add(url, "error", "Structured data", "schema-home-org", "Home page has no Organization schema", "Add organizationJsonLd() from src/lib/schema.js.");
    if (!has("WebSite")) add(url, "error", "Structured data", "schema-home-website", "Home page has no WebSite schema", "Add a WebSite node with @id /#website (it gives Google the site name).");
  } else if (!["other"].includes(type) && !has("BreadcrumbList")) add(url, "warning", "Structured data", "schema-no-breadcrumb", "No BreadcrumbList schema", "Add breadcrumbJsonLd() from src/lib/schema.js so results show a breadcrumb path.");
  if (type === "tool" && !has("WebApplication") && !has("SoftwareApplication")) add(url, "warning", "Structured data", "schema-tool-app", "Tool page has no WebApplication/SoftwareApplication schema", "Use toolJsonLd() from ToolPage.jsx.");
  if (type === "hub" && !has("CollectionPage") && !has("ItemList")) add(url, "notice", "Structured data", "schema-hub-list", "Category page has no CollectionPage/ItemList schema", "List the category's tools in an ItemList.");
}

// ------------------------------------------------------------------ main

async function main() {
  const started = Date.now();
  const date = today();
  console.log(`SEO audit of ${SITE_URL} (${src.mode})`);

  // robots.txt
  const robotsRes = await src.follow(`${SITE_URL}/robots.txt`);
  let rules = [];
  const robotsUrl = `${SITE_URL}/robots.txt`;
  if (robotsRes.status !== 200) add(robotsUrl, "error", "robots.txt", "robots-status", `robots.txt answered HTTP ${robotsRes.status || robotsRes.error}`, "Serve robots.txt with 200 (a 5xx makes Google stop crawling the site).");
  else {
    const parsed = parseRobots(robotsRes.body);
    rules = robotsRulesFor(parsed, "googlebot");
    if (MODE === "live" && !/text\/plain/.test(robotsRes.type)) add(robotsUrl, "warning", "robots.txt", "robots-type", `robots.txt Content-Type is "${robotsRes.type}"`, "Serve it as text/plain.");
    if (!parsed.groups.length) add(robotsUrl, "warning", "robots.txt", "robots-empty", "robots.txt has no User-agent groups", "Add at least: User-agent: * / Allow: /");
    if (!parsed.sitemaps.some((s) => s.replace(/\/$/, "") === `${SITE_URL}/sitemap.xml`)) add(robotsUrl, "warning", "robots.txt", "robots-sitemap", "robots.txt does not reference /sitemap.xml", `Add "Sitemap: ${SITE_URL}/sitemap.xml".`);
    if (!robotsAllowed(rules, `${SITE_URL}/`).allowed) add(robotsUrl, "error", "robots.txt", "robots-home-blocked", "robots.txt blocks Googlebot from the home page", "Remove the Disallow rule that matches /.");
    for (const bot of ["oai-searchbot", "perplexitybot", "claude-searchbot", "bingbot"]) {
      const g = parsed.groups.find((x) => x.agents.includes(bot));
      if (g && !robotsAllowed(g.rules, `${SITE_URL}/`).allowed) add(robotsUrl, "warning", "robots.txt", `robots-ai-${bot}`, `robots.txt blocks ${bot}`, "AI search engines can't cite pages they can't crawl. Allow AI search bots (training bots can stay blocked).");
    }
  }

  // sitemaps
  const sm = await readSitemaps(src);
  for (const p of sm.problems) add(p.file, p.severity, "Sitemap", "sitemap-" + p.issue.slice(0, 30).toLowerCase().replace(/[^a-z]+/g, "-"), p.issue, p.fix);
  const urls = [...sm.urls.keys()].slice(0, LIMIT);
  console.log(`  ${sm.files.length} sitemap file(s), ${sm.urls.size} URL(s); auditing ${urls.length}.`);
  for (const u of urls) {
    const rb = robotsAllowed(rules, u);
    if (!rb.allowed) add(u, "error", "robots.txt", "robots-blocks-sitemap-url", `Listed in the sitemap but blocked by robots.txt (${rb.rule})`, "Either allow the URL in robots.txt or remove it from the sitemap.");
  }

  // fetch and analyse every sitemap URL
  const pages = new Map();
  await pool(urls, CONCURRENCY, async (u) => {
    const r = await src.follow(u);
    const page = { url: u, type: pageType(u), status: r.status, error: r.error, chain: r.chain || [], finalUrl: r.finalUrl, ms: r.ms, a: null };
    if (r.status === 200 && /html/.test(r.type || "text/html")) page.a = analyse(r.finalUrl, r);
    pages.set(u, page);
  });
  console.log(`  fetched ${pages.size} page(s).`);

  const titles = new Map();
  const descs = new Map();
  for (const p of pages.values()) {
    const { url: u, type, a } = p;
    if (p.chain.length) add(u, "error", "HTTP status", "sitemap-redirect", `Sitemap URL redirects (${p.chain.map((c) => c.status).join(" → ")}) to ${p.finalUrl}`, "List only final, 200 URLs in the sitemap.");
    if (p.status !== 200) {
      add(u, "error", "HTTP status", "sitemap-status", `Answers HTTP ${p.status || p.error}`, p.status >= 500 ? "Fix the server error; Google drops pages that keep failing." : "Sitemap URLs must answer 200. Fix the page or remove it from the sitemap.");
      continue;
    }
    if (MODE === "live" && p.ms > 1500) add(u, "notice", "Performance", "slow-response", `Server took ${p.ms} ms to answer`, "Check caching/CDN; a slow server reduces how much Google crawls.");
    if (!a) continue;

    // titles and descriptions
    if (!a.title) add(u, "error", "Metadata", "title-missing", "No <title>", "Give every page a unique title in its Base props.");
    else {
      if (a.title.length > 60) add(u, "warning", "Metadata", "title-long", `Title is ${a.title.length} characters (Google cuts around 60)`, "Put the main keyword first and trim to ≤ 60 characters.");
      if (a.title.length < 25) add(u, "notice", "Metadata", "title-short", `Title is only ${a.title.length} characters`, "A more descriptive title (30–60 characters) usually earns more clicks.");
      (titles.get(a.title) || titles.set(a.title, []).get(a.title)).push(u);
    }
    if (a.description === null || a.description === "") add(u, "error", "Metadata", "desc-missing", "No meta description", "Write a 110–158 character description that answers the searcher's question.");
    else {
      if (a.description.length < 70 || a.description.length > 160) add(u, "warning", "Metadata", "desc-length", `Meta description is ${a.description.length} characters`, "Aim for 110–158 characters.");
      (descs.get(a.description) || descs.set(a.description, []).get(a.description)).push(u);
    }

    // canonical and robots
    if (/noindex/i.test(a.robots)) add(u, "error", "Indexability", "noindex-in-sitemap", `Listed in the sitemap but has "${a.robots}"`, "Remove noindex, or remove the URL from the sitemap.");
    if (!a.canonicals.length) add(u, "error", "Indexability", "canonical-missing", "No canonical tag", "Add <link rel=canonical> pointing at the page's own URL (Base.astro does this unless noindex).");
    else {
      if (a.canonicals.length > 1) add(u, "error", "Indexability", "canonical-multiple", `${a.canonicals.length} canonical tags`, "Keep exactly one; Google ignores conflicting canonicals.");
      if (!/^https?:\/\//.test(a.canonicals[0])) add(u, "warning", "Indexability", "canonical-relative", "Canonical URL is relative", "Use an absolute https:// URL.");
      if (absUrl(a.canonicals[0], u) !== u) add(u, "error", "Indexability", "canonical-not-self", `Canonical points to ${a.canonicals[0]}`, "A sitemap URL should be self-canonical. List the canonical URL in the sitemap instead, or fix the tag.");
    }
    if (!a.lang) add(u, "warning", "Metadata", "lang-missing", "<html> has no lang attribute", 'Add lang="en-IN".');
    if (!a.viewport) add(u, "error", "Mobile", "viewport-missing", "No viewport meta tag", 'Add <meta name="viewport" content="width=device-width, initial-scale=1">; without it Google treats the page as not mobile-friendly.');
    if (!a.charset) add(u, "notice", "Metadata", "charset-missing", "No <meta charset>", 'Add <meta charset="utf-8"> as the first tag in <head>.');
    if (a.h1.length === 0) add(u, "error", "Content", "h1-missing", "No <h1>", "Give the page one H1 that states what it is.");
    else if (a.h1.length > 1) add(u, "warning", "Content", "h1-multiple", `${a.h1.length} <h1> elements`, "Use one H1; make the others H2.");
    if (a.mixed) add(u, "warning", "Security", "mixed-content", `${a.mixed} resource(s) loaded over http://`, "Load every script, image and stylesheet over https://.");

    // Open Graph and Twitter
    for (const [k, code] of [["og:title", "og-title"], ["og:description", "og-desc"], ["og:image", "og-image"], ["og:url", "og-url"], ["og:type", "og-type"], ["twitter:card", "twitter-card"]])
      if (!a.og[k]) add(u, "warning", "Social metadata", code, `Missing ${k}`, `Add <meta ${k.startsWith("og") ? "property" : "name"}="${k}">; it controls how shared links look on WhatsApp, LinkedIn, X and Facebook.`);
    if (a.og["og:url"] && a.canonicals[0] && a.og["og:url"] !== a.canonicals[0]) add(u, "warning", "Social metadata", "og-url-mismatch", `og:url (${a.og["og:url"]}) differs from the canonical`, "Make og:url the canonical URL so share counts consolidate.");
    if (a.og["og:image"] && !/^https:\/\//.test(a.og["og:image"])) add(u, "warning", "Social metadata", "og-image-relative", "og:image is not an absolute https:// URL", "Social networks need an absolute URL.");
    if (a.og["og:image"] && !a.og["og:image:alt"] && !a.og["twitter:image:alt"]) add(u, "notice", "Social metadata", "og-image-alt", "Share image has no alt text", "Add og:image:alt / twitter:image:alt.");

    // images
    const noAlt = a.images.filter((i) => !i.hasAlt);
    if (noAlt.length) add(u, "error", "Images", "img-alt-missing", `${noAlt.length} image(s) without an alt attribute: ${noAlt.slice(0, 3).map((i) => i.rawSrc.slice(0, 60)).join(", ")}`, 'Describe each informative image in alt text; use alt="" for decorative ones.');
    const fileAlt = a.images.filter((i) => i.alt && /\.(png|jpe?g|webp|gif|svg|avif)$|^(img|image|dsc|screenshot)[-_ ]?\d*$/i.test(i.alt.trim()));
    if (fileAlt.length) add(u, "warning", "Images", "img-alt-filename", `${fileAlt.length} image(s) use a file name as alt text`, "Write alt text that describes what the image shows.");
    const longAlt = a.images.filter((i) => i.alt.length > 125);
    if (longAlt.length) add(u, "notice", "Images", "img-alt-long", `${longAlt.length} image(s) have alt text over 125 characters`, "Keep alt text short; screen readers read it in full.");
    const noDims = a.images.filter((i) => i.src && !/\.svg(\?|$)/i.test(i.src) && !(i.width && i.height));
    if (noDims.length) add(u, "warning", "Images", "img-dimensions", `${noDims.length} image(s) without width and height`, "Set width and height so the browser reserves space (prevents layout shift, CLS).");
    if (a.images.length > 3 && !a.images.slice(2).some((i) => i.lazy)) add(u, "notice", "Images", "img-lazy", "Images below the fold are not lazy-loaded", 'Add loading="lazy" to images after the first screen.');

    // links on the page
    for (const l of a.anchors) {
      if (!l.text) add(u, "warning", "Links", "anchor-empty", `Link to ${l.href} has no text`, "Give the link visible text or an aria-label; search engines use anchor text to understand the target.", l.href);
      else if (GENERIC_ANCHOR.test(l.text)) add(u, "notice", "Links", "anchor-generic", `Generic anchor text "${l.text}" → ${l.href}`, "Use descriptive anchor text (e.g. the target tool's name).", l.href);
      if (src.isInternal(l.href) && /nofollow/.test(l.rel)) add(u, "notice", "Links", "internal-nofollow", `Internal link to ${l.href} is nofollow`, "Remove nofollow from internal links so they pass signals.", l.href);
      if (src.isInternal(l.href) && /^http:/.test(l.href)) add(u, "warning", "Links", "internal-http", `Internal link uses http:// (${l.href})`, "Link to the https:// URL.", l.href);
    }

    // AEO / answer-engine readiness
    if (["tool", "hub"].includes(type)) {
      const hasFaq = a.ld.nodes.some((n) => typesOf(n).includes("FAQPage"));
      if (!hasFaq) add(u, "warning", "AEO", "aeo-no-faq", "No FAQ section / FAQPage schema", "Add 3–6 real questions people search for, each answered in 40–80 words, plus FAQPage JSON-LD.");
      const qHeads = a.headings.filter((x) => QUESTION.test(x));
      if (!qHeads.length) add(u, "notice", "AEO", "aeo-no-question-headings", "No question-style H2/H3 headings", 'Phrase some section headings as the questions users ask ("How is EMI calculated?") and answer directly below.');
      if (!a.firstP || a.firstP.split(" ").length > 120) add(u, "notice", "AEO", "aeo-direct-answer", "No short direct answer near the top of the page", "Open with a 40–60 word paragraph that defines the tool or answers the main query. AI assistants and featured snippets quote this.");
      if (a.words < THIN_WORDS) add(u, "warning", "Content", "thin", `Only ${a.words} words of main content`, `Add a worked example, method, and FAQs; pages under ${THIN_WORDS} words are often "Crawled – currently not indexed".`);
      if (type === "tool" && !a.ld.nodes.some((n) => n.dateModified)) add(u, "notice", "AEO", "aeo-no-date", "No dateModified in structured data", "Add dateModified so search and AI engines can see the page is maintained.");
    }
    checkSchema(u, type, a);
  }
  if (appsWithoutRating.size)
    add(SITE_URL + "/", "notice", "Structured data", "schema-app-rating", `${appsWithoutRating.size} tool page(s) have WebApplication schema without aggregateRating/review, so they are not eligible for the software-app rich result (stars)`, "Only add ratings if the page collects genuine user ratings; never invent them. The schema still helps search and AI engines understand each tool.");
  for (const [map, what, code] of [[titles, "title", "title-duplicate"], [descs, "meta description", "desc-duplicate"]])
    for (const [v, us] of map) if (us.length > 1) for (const u of us) add(u, "error", "Duplicates", code, `Same ${what} as ${us.length - 1} other page(s): ${us.filter((x) => x !== u).slice(0, 3).join(", ")}`, `Write a unique ${what} for each page ("${v.slice(0, 50)}${v.length > 50 ? "…" : ""}").`);

  // link graph
  const inbound = new Map(urls.map((u) => [u, { main: new Set(), all: new Set() }]));
  const targets = new Map(); // internal link/asset url -> [{ from, text, kind }]
  const external = new Map();
  const note = (map, url, rec) => (map.get(url) || map.set(url, []).get(url)).push(rec);
  for (const p of pages.values()) {
    if (!p.a) continue;
    for (const l of p.a.anchors) {
      if (src.isInternal(l.href)) {
        const key = l.href.replace(/^http:/, "https:").replace("://www.", "://");
        note(targets, key, { from: p.url, text: l.text, kind: "link" });
        if (inbound.has(key) && key !== p.url) {
          inbound.get(key).all.add(p.url);
          if (p.a.mainLinks.has(l.href)) inbound.get(key).main.add(p.url);
        }
      } else if (EXTERNAL) note(external, l.href, { from: p.url, text: l.text, kind: "link" });
    }
    for (const i of p.a.images) if (i.src) (src.isInternal(i.src) ? note(targets, i.src, { from: p.url, text: i.alt, kind: "image" }) : EXTERNAL && note(external, i.src, { from: p.url, text: i.alt, kind: "image" }));
    if (p.a.og["og:image"]) {
      const img = absUrl(p.a.og["og:image"], p.url);
      if (img) note(src.isInternal(img) ? targets : external, img, { from: p.url, text: "og:image", kind: "share image" });
    }
  }

  // check every internal target that is not an already-fetched sitemap URL
  const toCheck = [...targets.keys()].filter((t) => !pages.has(t));
  console.log(`  checking ${toCheck.length} internal link/asset target(s)${EXTERNAL ? ` and ${external.size} external` : ""}...`);
  const statusOf = new Map([...pages.values()].map((p) => [p.url, { status: p.status, chain: p.chain, finalUrl: p.finalUrl }]));
  await pool(toCheck, CONCURRENCY, async (t) => statusOf.set(t, await src.linkStatus(t)));
  const broken = [];
  for (const [t, refs] of targets) {
    const s = statusOf.get(t);
    if (!s) continue;
    const froms = [...new Set(refs.map((r) => r.from))];
    if (s.status >= 400 || s.status === 0 || s.loop) {
      for (const r of refs) broken.push({ source: r.from, target: t, kind: r.kind, status: s.status || s.error || "loop", anchor: r.text });
      for (const f of froms) add(f, "error", "Broken links", "broken-internal", `Broken internal ${refs[0].kind} → ${t} (HTTP ${s.status || s.error})`, "Fix the URL or remove the link; broken links waste crawl budget and frustrate users.", t);
    } else if (s.chain?.length && refs.some((r) => r.kind === "link")) {
      for (const f of froms) add(f, s.chain.length > 1 ? "warning" : "notice", "Redirects", "link-to-redirect", `Links to ${t}, which redirects${s.chain.length > 1 ? ` through ${s.chain.length} hops` : ""} to ${s.finalUrl}`, `Link straight to ${s.finalUrl}.`, t);
    } else if (refs.some((r) => r.kind === "share image") && s.status === 200 && s.type && !/^image\//.test(s.type)) {
      for (const f of froms) add(f, "warning", "Social metadata", "og-image-type", `og:image ${t} is served as ${s.type}`, "Serve share images with an image/* Content-Type.", t);
    }
  }
  if (EXTERNAL) {
    await pool([...external.keys()], 6, async (t) => {
      const s = await src.linkStatus(t);
      if (s.status >= 400 || s.status === 0) {
        const refs = external.get(t);
        for (const r of refs) broken.push({ source: r.from, target: t, kind: `external ${r.kind}`, status: s.status || s.error, anchor: r.text });
        for (const f of new Set(refs.map((r) => r.from))) add(f, s.status === 403 || s.status === 429 ? "notice" : "warning", "Broken links", "broken-external", `External ${refs[0].kind} → ${t} answered ${s.status || s.error}`, s.status === 403 || s.status === 429 ? "The site may block bots; check it in a browser." : "Update or remove the outbound link.", t);
      }
    });
  }

  // indexable pages that are linked but missing from the sitemap
  const notInSitemap = [...targets.keys()].filter((t) => !sm.urls.has(t) && statusOf.get(t)?.status === 200 && !statusOf.get(t)?.chain?.length && targets.get(t).some((r) => r.kind === "link") && !/\.(png|jpe?g|webp|svg|pdf|xml|txt|json|ico|css|js)(\?|$)/i.test(t));
  await pool(notInSitemap, CONCURRENCY, async (t) => {
    const r = await src.follow(t);
    if (r.status !== 200 || !/html/.test(r.type || "text/html")) return;
    const a = analyse(t, r);
    const self = a.canonicals[0] && absUrl(a.canonicals[0], t) === t;
    if (self && !/noindex/i.test(a.robots)) add(t, "warning", "Sitemap", "missing-from-sitemap", `Indexable page linked from ${targets.get(t).length} place(s) but not in the sitemap`, "Add it to the right sitemap file (src/pages/sitemap-*.xml.js), or noindex it if it shouldn't rank.");
  });

  // orphans and weakly linked pages (full runs only; a --limit run sees too few pages)
  if (LIMIT === Infinity) {
    for (const [u, inb] of inbound) {
      const t = pageType(u);
      if (u === `${SITE_URL}/` || pages.get(u)?.status !== 200) continue;
      if (!inb.all.size) add(u, "error", "Internal links", "orphan", "Orphan page: no internal links point to it", "Link to it from its category hub and 2–3 related pages.");
      else if (t !== "info" && inb.main.size < MIN_CONTEXT_LINKS) add(u, inb.main.size ? "notice" : "warning", "Internal links", "weak-links", `Only ${inb.main.size} contextual link(s) from other pages (${inb.all.size} incl. menus)`, "See the link-suggestions report for pages that should link here.");
    }
  }

  // internal linking recommendations
  const tok = new Map();
  for (const p of pages.values()) if (p.a) tok.set(p.url, new Set(tokens(`${p.a.title} ${p.a.h1[0] || ""} ${p.a.description || ""} ${new URL(p.url).pathname}`)));
  const section = (u) => new URL(u).pathname.split("/")[1] || "";
  const suggestions = [];
  for (const [u, inb] of inbound) {
    const p = pages.get(u);
    if (!p?.a || ["info", "home"].includes(p.type) || inb.main.size >= MIN_CONTEXT_LINKS) continue;
    const mine = tok.get(u);
    const cands = [];
    for (const [v, theirs] of tok) {
      const q = pages.get(v);
      if (v === u || inb.main.has(v) || ["info"].includes(q.type)) continue;
      let shared = 0;
      for (const w of mine) if (theirs.has(w)) shared++;
      const score = shared / Math.max(1, Math.min(mine.size, theirs.size)) + (section(v) === section(u) ? 0.35 : 0) + (q.type === "hub" && section(v) === section(u) ? 0.5 : 0);
      if (score >= 0.35) cands.push({ v, score, shared: [...mine].filter((w) => theirs.has(w)).slice(0, 5) });
    }
    cands.sort((a, b) => b.score - a.score);
    for (const c of cands.slice(0, 3))
      suggestions.push({
        target: u,
        target_contextual_links: inb.main.size,
        link_from: c.v,
        score: c.score.toFixed(2),
        suggested_anchor: p.a.h1[0] || p.a.title,
        why: c.shared.length ? `Both pages cover: ${c.shared.join(", ")}` : "Same section",
      });
  }

  // soft-404 check
  const probe = `${SITE_URL}/seo-audit-check-${Date.now().toString(36)}`;
  if (MODE === "live") {
    const r = await src.follow(probe);
    if (r.status === 200) add(probe, "error", "HTTP status", "soft-404", "A non-existent URL answers 200 (soft 404)", "Unknown URLs must answer 404 or 410; configure the server's error page.");
    else if (r.status !== 404 && r.status !== 410) add(probe, "warning", "HTTP status", "unknown-status", `A non-existent URL answers ${r.status}`, "Unknown URLs should answer 404.");
  }

  // Collapse issues that come from a shared template (header, footer, consent bar) into one row each,
  // so 150 copies of the same footer notice don't bury page-specific problems.
  const groups = new Map();
  for (const i of issues) if (["anchor-generic", "anchor-empty", "internal-nofollow", "internal-http"].includes(i.code)) (groups.get(`${i.code}|${i.target}`) || groups.set(`${i.code}|${i.target}`, []).get(`${i.code}|${i.target}`)).push(i);
  for (const list of groups.values()) {
    if (list.length < Math.max(5, pages.size * 0.5)) continue;
    const drop = new Set(list);
    for (let k = issues.length - 1; k >= 0; k--) if (drop.has(issues[k])) issues.splice(k, 1);
    issues.push({ ...list[0], url: SITE_URL + "/", issue: `${list[0].issue} — on ${list.length} pages (shared header/footer/template)`, fix: `${list[0].fix} Fix it once in the shared component.` });
  }

  // ---------------------------------------------------------------- compare and write
  const sevOrder = { error: 0, warning: 1, notice: 2 };
  const key = (i) => `${i.code}|${i.url}|${i.target}`;
  const histFiles = (() => {
    try {
      return readdirSync(HIST_DIR).filter((f) => f.startsWith(`${MODE}-`) && f.endsWith(".json") && f !== `${MODE}-${date}.json`).sort();
    } catch {
      return [];
    }
  })();
  const prev = histFiles.length ? readJson(join(HIST_DIR, histFiles[histFiles.length - 1]), null) : null;
  const prevKeys = new Set(prev?.keys || []);
  const nowKeys = new Set(issues.map(key));
  for (const i of issues) i.status = prev ? (prevKeys.has(key(i)) ? "existing" : "new") : "";
  const resolved = prev ? [...prevKeys].filter((k) => !nowKeys.has(k)) : [];
  issues.sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity] || a.check.localeCompare(b.check) || a.url.localeCompare(b.url));

  const count = (s) => issues.filter((i) => i.severity === s).length;
  const byCheck = {};
  for (const i of issues) {
    const c = (byCheck[i.check] ||= { error: 0, warning: 0, notice: 0 });
    c[i.severity]++;
  }
  const summary = {
    date,
    mode: src.mode,
    site: SITE_URL,
    pages: pages.size,
    sitemapUrls: sm.urls.size,
    errors: count("error"),
    warnings: count("warning"),
    notices: count("notice"),
    newIssues: issues.filter((i) => i.status === "new").length,
    resolvedIssues: resolved.length,
    previousDate: prev?.date || "",
    brokenLinks: broken.length,
    byCheck,
    seconds: Math.round((Date.now() - started) / 1000),
  };

  const base = join(OUT_DIR, `seo-audit-${date}${MODE === "dist" ? "-dist" : ""}`);
  writeText(`${base}-issues.csv`, csv(issues, ["severity", "check", "url", "issue", "fix", "target", "status"]));
  writeText(`${base}-broken-links.csv`, csv(broken, ["source", "target", "kind", "status", "anchor"]));
  writeText(`${base}-link-suggestions.csv`, csv(suggestions, ["target", "target_contextual_links", "link_from", "score", "suggested_anchor", "why"]));
  const pageRows = [...pages.values()].map((p) => ({
    url: p.url,
    type: p.type,
    status: p.status || p.error,
    redirect_to: p.chain.length ? p.finalUrl : "",
    response_ms: p.ms,
    title: p.a?.title || "",
    title_length: p.a?.title?.length ?? "",
    description_length: p.a?.description?.length ?? "",
    canonical: p.a?.canonicals?.[0] || "",
    robots: p.a?.robots || "",
    h1: p.a?.h1?.[0] || "",
    words: p.a?.words ?? "",
    images: p.a?.images.length ?? "",
    images_without_alt: p.a ? p.a.images.filter((i) => !i.hasAlt).length : "",
    schema_types: p.a ? [...new Set(p.a.ld.nodes.flatMap(typesOf))].join(" ") : "",
    links_in: inbound.get(p.url)?.all.size ?? "",
    contextual_links_in: inbound.get(p.url)?.main.size ?? "",
    links_out: p.a?.anchors.length ?? "",
    issues: issues.filter((i) => i.url === p.url).length,
  }));
  writeText(`${base}-pages.csv`, csv(pageRows, Object.keys(pageRows[0] || { url: "" })));
  const topIssues = issues.filter((i) => i.severity !== "notice").slice(0, 200);
  writeJson(join(HIST_DIR, `latest-${MODE}.json`), { ...summary, files: { issues: `${base}-issues.csv`, pages: `${base}-pages.csv`, broken: `${base}-broken-links.csv`, links: `${base}-link-suggestions.csv` }, topIssues, suggestions: suggestions.slice(0, 50), resolved: resolved.slice(0, 100) });
  if (LIMIT === Infinity) writeJson(join(HIST_DIR, `${MODE}-${date}.json`), { date, keys: [...nowKeys] });

  console.log(`\n${pages.size} pages: ${summary.errors} error(s), ${summary.warnings} warning(s), ${summary.notices} notice(s).`);
  for (const [c, n] of Object.entries(byCheck)) console.log(`  ${c.padEnd(18)} ${n.error} errors, ${n.warning} warnings, ${n.notice} notices`);
  if (prev) console.log(`Since ${prev.date}: ${summary.newIssues} new, ${resolved.length} resolved.`);
  console.log(`${broken.length} broken link(s); ${suggestions.length} internal-link suggestion(s).`);
  console.log(`Reports: ${base}-*.csv`);
  process.exit(STRICT && summary.errors ? 1 : 0);
}

main().catch((e) => {
  console.error("error:", e.stack || e.message);
  process.exit(1);
});
