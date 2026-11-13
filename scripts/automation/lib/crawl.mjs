// Shared crawler helpers for the SEO automation: fetching pages (live site or the built dist/ folder),
// reading sitemaps and robots.txt, parsing HTML without extra packages, and writing CSV.
import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

export const UA = "Mozilla/5.0 (compatible; FreeToolsPro-SEOBot/1.0; +https://freetoolspro.in)";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Run fn over items with at most n in flight. */
export async function pool(items, n, fn) {
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

// ------------------------------------------------------------------ HTML parsing

export const decode = (s) =>
  String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
export const attr = (tag, name) =>
  (tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, "i")) || tag.match(new RegExp(`\\s${name}\\s*=\\s*'([^']*)'`, "i")) || [])[1];
export const hasAttr = (tag, name) => new RegExp(`\\s${name}(\\s*=|\\s|/?>)`, "i").test(tag);
export const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, "gi"))].map((m) => m[0]);
export function metaContent(html, key, val) {
  const t = tags(html, "meta").find((x) => (attr(x, key) || "").toLowerCase() === val.toLowerCase());
  return t ? decode(attr(t, "content") ?? "") : null;
}
export const stripTags = (s) => decode(String(s).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** Absolute, fragment-free URL for an href, or null for mailto:, javascript:, data: and the like. */
export function absUrl(href, base) {
  if (!href || /^(mailto:|tel:|javascript:|data:|#)/i.test(href.trim())) return null;
  try {
    const u = new URL(href.trim(), base);
    if (!/^https?:$/.test(u.protocol)) return null;
    u.hash = "";
    return u.href;
  } catch {
    return null;
  }
}

/** Every JSON-LD node on the page (with @graph flattened). Returns { nodes, errors }. */
export function jsonLd(html) {
  const nodes = [];
  const errors = [];
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      const walk = (x) => {
        if (Array.isArray(x)) return x.forEach(walk);
        if (!x || typeof x !== "object") return;
        if (x["@graph"]) walk(x["@graph"]);
        if (x["@type"]) nodes.push(x);
      };
      walk(j);
    } catch (e) {
      errors.push(e.message);
    }
  }
  return { nodes, errors };
}
export const typesOf = (n) => [].concat(n["@type"] || []);

// ------------------------------------------------------------------ fetching (live or dist/)

/**
 * A page source. Live: real HTTP with manual redirects. Dist: reads the built files the way the
 * static host serves them (/a/b -> a/b.html, / -> index.html; Astro's meta-refresh pages count as 301).
 */
export function makeSource({ siteUrl, dist = null, timeoutMs = 20000 }) {
  const site = siteUrl.replace(/\/$/, "");
  const host = new URL(site).host;
  const isInternal = (u) => {
    try {
      return new URL(u).host.replace(/^www\./, "") === host.replace(/^www\./, "");
    } catch {
      return false;
    }
  };

  async function liveFetch(url, { method = "GET", body = true } = {}) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    const t0 = Date.now();
    try {
      const r = await fetch(url, { method, redirect: "manual", signal: ctl.signal, headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" } });
      const type = r.headers.get("content-type") || "";
      const text = body && r.status === 200 && /text|xml|json|javascript/.test(type) ? await r.text() : "";
      if (!body || !text) r.body?.cancel?.().catch(() => {});
      return { status: r.status, location: r.headers.get("location") || "", type, xRobots: r.headers.get("x-robots-tag") || "", length: Number(r.headers.get("content-length")) || text.length, ms: Date.now() - t0, body: text };
    } catch (e) {
      return { status: 0, location: "", type: "", xRobots: "", ms: Date.now() - t0, body: "", error: e.name === "AbortError" ? "timeout" : e.cause?.code || e.message };
    } finally {
      clearTimeout(timer);
    }
  }

  function distFetch(url) {
    const u = new URL(url);
    let p = decodeURIComponent(u.pathname);
    const candidates = p === "/" ? ["index.html"] : /\.[a-z0-9]+$/i.test(p) ? [p.slice(1)] : [p.slice(1) + ".html", p.slice(1) + "/index.html"];
    for (const c of candidates) {
      const fp = join(dist, c);
      if (existsSync(fp) && statSync(fp).isFile()) {
        const isText = /\.(html|xml|txt|json|js|css|svg|webmanifest)$/i.test(fp);
        const text = isText ? readFileSync(fp, "utf8") : "";
        const refresh = /\.html$/.test(fp) && text.length < 4000 ? (text.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']\d+;\s*url=([^"']+)["']/i) || [])[1] : null;
        if (refresh) return { status: 301, location: refresh, type: "text/html", xRobots: "", ms: 0, body: "" };
        const ext = (fp.match(/\.([a-z0-9]+)$/i) || [])[1].toLowerCase();
        const type = { html: "text/html", xml: "application/xml", txt: "text/plain", json: "application/json", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", avif: "image/avif", svg: "image/svg+xml", ico: "image/x-icon", pdf: "application/pdf" }[ext] || "application/octet-stream";
        return { status: 200, location: "", type, xRobots: "", ms: 0, length: statSync(fp).size, body: text };
      }
    }
    return { status: 404, location: "", type: "", xRobots: "", ms: 0, body: "" };
  }

  /** One request, no redirect following. */
  async function get(url, opts) {
    if (dist && isInternal(url)) return distFetch(url.replace(/^https?:\/\/[^/]+/, site));
    return liveFetch(url, opts);
  }

  /** Follow redirects (max 10). Returns the final response plus the chain of hops. */
  async function follow(url, opts) {
    const chain = [];
    let cur = url;
    for (let i = 0; i < 10; i++) {
      const r = await get(cur, opts);
      if (r.status >= 300 && r.status < 400 && r.location) {
        const next = new URL(r.location, cur).href;
        chain.push({ url: cur, status: r.status, to: next });
        if (chain.some((c) => c.url === next)) return { ...r, finalUrl: next, chain, loop: true };
        cur = next;
        continue;
      }
      return { ...r, finalUrl: cur, chain };
    }
    return { status: 0, error: "more than 10 redirects", finalUrl: cur, chain };
  }

  /** Status of a linked resource; HEAD first for external links, GET when a server refuses HEAD. */
  async function linkStatus(url) {
    if (dist && isInternal(url)) return follow(url, { body: false });
    let r = await follow(url, { method: "HEAD", body: false });
    if (r.status === 0 || r.status === 403 || r.status === 405 || r.status === 501) r = await follow(url, { body: false });
    return r;
  }

  return { site, host, isInternal, get, follow, linkStatus, mode: dist ? `dist (${dist})` : "live" };
}

// ------------------------------------------------------------------ sitemaps

const W3C_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/;

/**
 * Reads /sitemap.xml and every sitemap it lists, and validates them against the sitemaps.org rules.
 * Returns { files: [{ url, status, type, count, bytes }], urls: Map(url -> { file, lastmod }), problems: [{ file, issue, fix, severity }] }
 */
export async function readSitemaps(src, root = `${src.site}/sitemap.xml`) {
  const files = [];
  const urls = new Map();
  const problems = [];
  const bad = (file, issue, fix, severity = "error") => problems.push({ file, issue, fix, severity });
  const locs = (xml, tag) => [...xml.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "g"))].map((m) => ({ loc: decode((m[1].match(/<loc>\s*([^<]*?)\s*<\/loc>/) || [])[1] || ""), lastmod: ((m[1].match(/<lastmod>\s*([^<]*?)\s*<\/lastmod>/) || [])[1] || "").trim() }));
  const seen = new Set();

  async function readOne(file, depth) {
    if (seen.has(file)) return bad(file, "Sitemap is listed more than once", "List each sitemap file once in the index.", "warning");
    seen.add(file);
    const r = await src.follow(file);
    const rec = { url: file, status: r.status, type: r.type, count: 0, bytes: r.body.length };
    files.push(rec);
    if (r.chain?.length) bad(file, `Sitemap redirects to ${r.finalUrl}`, "Reference the final sitemap URL directly in robots.txt, the index and Search Console.", "warning");
    if (r.status !== 200) return bad(file, `Sitemap answered HTTP ${r.status || r.error}`, "The sitemap must answer 200. Rebuild and redeploy, and check the server routes .xml files.");
    if (src.mode === "live" && !/xml/.test(r.type)) bad(file, `Content-Type is "${r.type}"`, "Serve sitemaps as application/xml (or text/xml).", "warning");
    const xml = r.body.trim();
    if (!/^<\?xml/.test(xml)) bad(file, "Missing the <?xml ?> declaration", "Start the file with <?xml version=\"1.0\" encoding=\"UTF-8\"?>.", "warning");
    if (Buffer.byteLength(xml) > 50 * 1024 * 1024) bad(file, "Sitemap is larger than 50 MB uncompressed", "Split it into several sitemaps listed in the index.");
    const isIndex = /<sitemapindex\b/.test(xml);
    if (!isIndex && !/<urlset\b/.test(xml)) return bad(file, "Neither <urlset> nor <sitemapindex> found", "The file is not a valid sitemap. Check what the server returns for this URL.");
    if (!/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(xml)) bad(file, "Missing the sitemaps.org namespace", 'Add xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" to the root element.');
    const open = (xml.match(/<(url|sitemap)>/g) || []).length;
    const close = (xml.match(/<\/(url|sitemap)>/g) || []).length;
    if (open !== close) bad(file, "Unbalanced <url>/<sitemap> tags (XML is malformed)", "Regenerate the sitemap; a template error is breaking the XML.");
    const entries = locs(xml, isIndex ? "sitemap" : "url");
    rec.count = entries.length;
    if (entries.length > 50000) bad(file, `${entries.length} entries (limit is 50,000)`, "Split it into several sitemaps listed in the index.");
    if (!entries.length) bad(file, "Sitemap has no entries", "Check the generator: an empty sitemap usually means the page list failed to load at build time.", "warning");
    const now = Date.now() + 864e5;
    for (const e of entries) {
      if (!e.loc) {
        bad(file, "An entry has an empty <loc>", "Every <url> needs an absolute <loc>.");
        continue;
      }
      let u;
      try {
        u = new URL(e.loc);
      } catch {
        bad(file, `Invalid URL in <loc>: ${e.loc}`, "Use absolute https:// URLs.");
        continue;
      }
      if (u.protocol !== "https:") bad(file, `Non-HTTPS URL: ${e.loc}`, "List the https:// version of every URL.");
      if (u.host !== src.host) bad(file, `URL on another host: ${e.loc}`, `A sitemap may only list URLs on ${src.host}.`);
      if (e.lastmod && !W3C_DATE.test(e.lastmod)) bad(file, `Invalid <lastmod> "${e.lastmod}" for ${e.loc}`, "Use W3C format: YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+05:30.");
      else if (e.lastmod && Date.parse(e.lastmod) > now) bad(file, `<lastmod> ${e.lastmod} is in the future for ${e.loc}`, "Google ignores lastmod values it can't trust. Use the real modification date.", "warning");
      if (isIndex) {
        if (depth > 0) bad(file, "A sitemap index lists another sitemap index", "Nested sitemap indexes are not allowed; list the child sitemaps directly.");
        else await readOne(e.loc, depth + 1);
      } else if (urls.has(e.loc)) bad(file, `Duplicate URL ${e.loc} (also in ${urls.get(e.loc).file})`, "List each URL in one sitemap only.", "warning");
      else urls.set(e.loc, { file: file.replace(src.site, ""), lastmod: e.lastmod });
    }
  }

  await readOne(root, 0);
  return { files, urls, problems };
}

// ------------------------------------------------------------------ robots.txt

/** Parses robots.txt into groups and Sitemap lines. */
export function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let cur = null;
  let lastWasAgent = false;
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const k = m[1].toLowerCase();
    if (k === "sitemap") {
      sitemaps.push(m[2].trim());
      continue;
    }
    if (k === "user-agent") {
      if (!lastWasAgent) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(m[2].toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (cur && (k === "allow" || k === "disallow")) cur.rules.push({ allow: k === "allow", path: m[2] });
    }
  }
  return { groups, sitemaps };
}

export function robotsRulesFor(parsed, agent = "googlebot") {
  const g = parsed.groups.find((x) => x.agents.includes(agent.toLowerCase())) || parsed.groups.find((x) => x.agents.includes("*"));
  return g ? g.rules : [];
}

export function robotsAllowed(rules, url) {
  const u = new URL(url);
  const path = u.pathname + u.search;
  let best = null;
  for (const r of rules) {
    if (!r.path) continue;
    const re = new RegExp("^" + r.path.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    if (!re.test(path)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  return best ? { allowed: best.allow, rule: `${best.allow ? "Allow" : "Disallow"}: ${best.path}` } : { allowed: true, rule: "" };
}

// ------------------------------------------------------------------ CSV

export function csv(rows, cols) {
  const cell = (v) => {
    const s = Array.isArray(v) ? v.join(" | ") : v == null ? "" : String(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n") + "\r\n";
}

/** Reads a CSV written by csv() (or by the index monitor) back into objects. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let q = false;
  const s = String(text).replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"' && s[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") row.push(cell), (cell = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  const [head, ...body] = rows.filter((r) => r.length > 1 || r[0]);
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}
