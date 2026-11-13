// Crawler's-eye SEO check: reads every sitemap URL as raw HTML (no JavaScript runs, exactly what a
// crawler receives first) and checks its title, description, canonical, robots directives, H1 and JSON-LD.
//
//   npm run check:seo                         checks the built site in dist/
//   npm run check:seo -- https://freetoolspro.in   checks the live site
//
// Fails (exit 1) on errors; prints warnings for things worth a look.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://freetoolspro.in";
const target = process.argv[2];
const live = !!target && /^https?:\/\//.test(target);
const base = live ? target.replace(/\/$/, "") : SITE;
const dist = live ? null : target || "dist";

const errors = [];
const warns = [];
const err = (u, m) => errors.push(`${u}: ${m}`);
const warn = (u, m) => warns.push(`${u}: ${m}`);

async function get(path) {
  if (live) {
    const r = await fetch(base + path, { redirect: "manual", headers: { "User-Agent": "FreeToolsPro-SEO-check" } });
    return { status: r.status, location: r.headers.get("location"), xrobots: r.headers.get("x-robots-tag"), body: r.status === 200 ? await r.text() : "" };
  }
  const file = path === "/" ? "index.html" : path.replace(/^\//, "") + (/\.(xml|txt|json)$/.test(path) ? "" : ".html");
  const fp = join(dist, file);
  return existsSync(fp) ? { status: 200, body: readFileSync(fp, "utf8") } : { status: 404, body: "" };
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`, "i")) || [])[1];
const metaTag = (html, key, val) => [...html.matchAll(/<(?:meta|link)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)].map((m) => m[0]).find((t) => (attr(t, key) || "").toLowerCase() === val);

const locs = async (path) => [...(await get(path)).body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const maps = await locs("/sitemap.xml");
if (!maps.length) {
  console.error("No sitemaps found in /sitemap.xml" + (live ? "" : " (run npm run build first)"));
  process.exit(1);
}
const urls = [];
for (const m of maps) urls.push(...(await locs(m.replace(SITE, ""))));

const seenTitle = new Map();
const seenDesc = new Map();
let homeTitle = null;

async function check(u) {
  const path = u.replace(SITE, "") || "/";
  const r = await get(path);
  if (r.status !== 200) return err(u, `status ${r.status}${r.location ? " -> " + r.location : ""} (sitemap URLs must answer 200)`);
  const h = r.body;
  const title = decode((h.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "").trim();
  const desc = decode(attr(metaTag(h, "name", "description") || "", "content") || "");
  const canon = attr(metaTag(h, "rel", "canonical") || "", "href");
  const robots = (attr(metaTag(h, "name", "robots") || "", "content") || "") + " " + (r.xrobots || "");
  const h1s = (h.match(/<h1\b/gi) || []).length;
  if (!title) err(u, "no <title> in the HTML");
  else if (title.length > 60) warn(u, `title is ${title.length} characters (Google may cut it off)`);
  if (!desc) err(u, "no meta description in the HTML");
  else if (desc.length < 70 || desc.length > 160) warn(u, `description is ${desc.length} characters`);
  if (canon !== u) err(u, `canonical is ${canon || "missing"} (should be ${u})`);
  if (/noindex/i.test(robots)) err(u, "is noindex but listed in the sitemap");
  if (h1s !== 1) err(u, `has ${h1s} <h1> elements`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      err(u, "has JSON-LD that does not parse");
    }
  }
  if (!/application\/ld\+json/.test(h)) warn(u, "has no structured data");
  if (path === "/") homeTitle = title;
  for (const [map, v] of [[seenTitle, title], [seenDesc, desc]]) {
    if (!v) continue;
    if (map.has(v)) err(u, `duplicate ${map === seenTitle ? "title" : "description"} (also on ${map.get(v)})`);
    else map.set(v, u);
  }
}

for (let i = 0; i < urls.length; i += 10) await Promise.all(urls.slice(i, i + 10).map(check));
if (homeTitle) for (const [t, u] of seenTitle) if (t === homeTitle && u !== `${SITE}/`) err(u, "shows the home page title (SPA/prerender problem)");

console.log(`Checked ${urls.length} sitemap URLs in ${live ? base : dist} as raw HTML (no JavaScript).`);
warns.forEach((w) => console.warn("warn:", w));
errors.forEach((e) => console.error("error:", e));
console.log(errors.length ? `\n${errors.length} error(s), ${warns.length} warning(s).` : `\nAll ${urls.length} URLs deliver their own title, description, canonical and indexable robots directives. ${warns.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
