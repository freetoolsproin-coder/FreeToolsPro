// Text-engine tools added in the October 2026 expansion (SEO, writing, creator and developer).
// Same contract as texts.js: run(input, options, input2) -> result. Extra result keys used here:
// checks[{status:"ok"|"warn"|"bad"|"info", label, detail}] and tables[{title, cols, rows}].
import { wordList, STOP } from "./textlib.js";
import { minifyJs } from "./jsmin.js";

const sel = (id, label, def, options) => ({ id, label, type: "select", def, options });
const tog = (id, label, def = false) => ({ id, label, type: "toggle", def });
const numo = (id, label, def, min, max) => ({ id, label, type: "number", def, min, max });
const txt = (id, label, def = "", placeholder = "", extra = {}) => ({ id, label, type: "text", def, placeholder, ...extra });

const fmtN = (n) => new Intl.NumberFormat("en-IN").format(n);
const kb = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`);
const bytesOf = (s) => new TextEncoder().encode(s).length;
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const chars = (s) => [...s].length;
const ok = (label, detail = "") => ({ status: "ok", label, detail });
const warn = (label, detail = "") => ({ status: "warn", label, detail });
const bad = (label, detail = "") => ({ status: "bad", label, detail });
const info = (label, detail = "") => ({ status: "info", label, detail });

// ---------- tiny HTML head parser (works on the server and in the browser) ----------
function attrs(tag) {
  const out = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  const body = tag.replace(/^<\s*[a-z0-9]+/i, "").replace(/\/?>$/, "");
  let m;
  while ((m = re.exec(body))) out[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  return out;
}
function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&");
}
function parseHead(html) {
  const noComments = html.replace(/<!--[\s\S]*?-->/g, "");
  const headEnd = noComments.search(/<\/head\s*>|<body[\s>]/i);
  const metas = [...noComments.matchAll(/<meta\b[^>]*>/gi)].map((m) => ({ ...attrs(m[0]), _inHead: headEnd < 0 || m.index < headEnd }));
  const links = [...noComments.matchAll(/<link\b[^>]*>/gi)].map((m) => ({ ...attrs(m[0]), _inHead: headEnd < 0 || m.index < headEnd }));
  const title = (noComments.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const meta = (key) => {
    const k = key.toLowerCase();
    const found = metas.find((m) => (m.property || m.name || "").toLowerCase() === k);
    return found ? found.content ?? "" : undefined;
  };
  return { metas, links, title: title !== undefined ? decodeEntities(title.trim().replace(/\s+/g, " ")) : undefined, meta, headEnd };
}
function absolute(u, base) {
  try {
    return new URL(u, base || undefined).href;
  } catch {
    return null;
  }
}
const isAbs = (u) => /^https?:\/\//i.test(u || "");

// ---------- robots.txt ----------
const ROBOT_UA = {
  googlebot: ["googlebot"],
  "googlebot-image": ["googlebot-image", "googlebot"],
  "googlebot-news": ["googlebot-news", "googlebot"],
  bingbot: ["bingbot"],
  gptbot: ["gptbot"],
  "google-extended": ["google-extended"],
  ccbot: ["ccbot"],
};
function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  const issues = [];
  let cur = null;
  let lastWasAgent = false;
  text.split(/\r?\n/).forEach((raw, idx) => {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) return;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) {
      issues.push(warn(`Line ${idx + 1} is not a valid rule`, raw.trim()));
      return;
    }
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === "user-agent") {
      if (!cur || !lastWasAgent) {
        cur = { agents: [], rules: [], line: idx + 1 };
        groups.push(cur);
      }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
      return;
    }
    lastWasAgent = false;
    if (key === "sitemap") {
      sitemaps.push(val);
      if (!isAbs(val)) issues.push(bad(`Sitemap on line ${idx + 1} must be a full URL`, val));
      return;
    }
    if (key === "allow" || key === "disallow") {
      if (!cur) {
        issues.push(bad(`Rule on line ${idx + 1} comes before any User-agent line, so crawlers ignore it`, raw.trim()));
        return;
      }
      if (val && !val.startsWith("/") && !val.startsWith("*")) issues.push(warn(`Path on line ${idx + 1} should start with /`, raw.trim()));
      cur.rules.push({ type: key, path: val, line: idx + 1 });
      return;
    }
    if (key === "crawl-delay") issues.push(info(`Crawl-delay on line ${idx + 1}`, "Google ignores Crawl-delay; Bing and Yandex respect it."));
    else if (key === "noindex") issues.push(bad(`Noindex on line ${idx + 1} is not supported`, "Google stopped supporting noindex in robots.txt in 2019. Use a meta robots tag or X-Robots-Tag header."));
    else if (key === "host") issues.push(info(`Host on line ${idx + 1}`, "Only Yandex used this directive. Others ignore it."));
    else issues.push(warn(`Unknown directive '${m[1]}' on line ${idx + 1}`, "Crawlers ignore lines they do not recognise."));
  });
  return { groups, sitemaps, issues };
}
function patternToRegex(p) {
  let s = "";
  for (const ch of p) s += ch === "*" ? ".*" : ch === "$" ? "$" : ch.replace(/[.+?^{}()|[\]\\/]/g, "\\$&");
  // A "$" only anchors at the very end of the pattern.
  if (p.includes("$") && !p.endsWith("$")) s = s.replace(/\$(?!$)/g, "\\$");
  return new RegExp("^" + s);
}
function robotsVerdict(parsed, ua, path) {
  const chain = ROBOT_UA[ua] || [ua.toLowerCase()];
  let rules = null;
  let agent = "*";
  for (const token of chain) {
    const g = parsed.groups.filter((x) => x.agents.includes(token));
    if (g.length) {
      rules = g.flatMap((x) => x.rules);
      agent = token;
      break;
    }
  }
  if (!rules) {
    const g = parsed.groups.filter((x) => x.agents.includes("*"));
    rules = g.length ? g.flatMap((x) => x.rules) : [];
    agent = g.length ? "*" : "(no group)";
  }
  if (path === "/robots.txt") return { allowed: true, rule: "robots.txt is always allowed", agent };
  let best = null;
  for (const r of rules) {
    if (!r.path) continue;
    let re;
    try {
      re = patternToRegex(r.path);
    } catch {
      continue;
    }
    if (!re.test(path)) continue;
    const len = r.path.length;
    if (!best || len > best.path.length || (len === best.path.length && r.type === "allow")) best = r;
  }
  if (!best) return { allowed: true, rule: "No matching rule", agent };
  return { allowed: best.type === "allow", rule: `Line ${best.line}: ${best.type === "allow" ? "Allow" : "Disallow"}: ${best.path}`, agent };
}
function toPath(u) {
  const s = u.trim();
  if (!s) return null;
  try {
    const x = new URL(s);
    return x.pathname + x.search;
  } catch {
    return s.startsWith("/") ? s : "/" + s;
  }
}

// ---------- HTTP status meanings ----------
const STATUS = {
  200: "OK",
  201: "Created",
  204: "No Content",
  206: "Partial Content",
  301: "Moved Permanently (permanent redirect)",
  302: "Found (temporary redirect)",
  303: "See Other (redirect after a form)",
  304: "Not Modified (served from cache)",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized (login needed)",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  410: "Gone (removed for good)",
  429: "Too Many Requests (rate limited)",
  451: "Unavailable for Legal Reasons",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};
function parseHeaderBlocks(text) {
  const blocks = [];
  let cur = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/^[<>]\s?/, "").trim();
    const st = line.match(/^HTTP\/[\d.]+\s+(\d{3})\s*(.*)$/i);
    if (st) {
      cur = { status: +st[1], reason: st[2], headers: [] };
      blocks.push(cur);
      continue;
    }
    const h = line.match(/^(:?[A-Za-z0-9-]+)\s*:\s*(.*)$/);
    if (h) {
      if (!cur) {
        cur = { status: null, reason: "", headers: [] };
        blocks.push(cur);
      }
      const name = h[1].toLowerCase();
      if ((name === ":status" || name === "status") && /^\d{3}/.test(h[2])) cur.status = +h[2].slice(0, 3);
      else cur.headers.push([name, h[2].trim()]);
    }
  }
  return blocks;
}

// ---------- summarizer ----------
const ABBR = /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|e\.g|i\.e|Rs|No|Fig|approx|Inc|Ltd|Co|Govt|Dept)\.$/i;
function splitSentences(text) {
  const out = [];
  for (const para of text.split(/\n\s*\n/)) {
    const flat = para.replace(/\s+/g, " ").trim();
    if (!flat) continue;
    const pieces = flat.split(/(?<=[.!?।])\s+(?=["'“‘(\[]?[\p{Lu}\p{N}₹$])/u);
    let buf = "";
    pieces.forEach((p, i) => {
      buf = buf ? `${buf} ${p}` : p;
      if (ABBR.test(buf) && i < pieces.length - 1) return;
      out.push({ text: buf, para: out.filter((s) => s.paraStart).length, paraStart: buf === p && (i === 0 || !buf) });
      buf = "";
    });
    if (buf) out.push({ text: buf });
    if (out.length) {
      // mark the first sentence of this paragraph
      const firstIdx = out.length - pieces.length >= 0 ? out.length - pieces.length : 0;
      if (out[firstIdx]) out[firstIdx].first = true;
    }
  }
  return out.map((s, i) => ({ ...s, i }));
}
const stem = (w) => w.replace(/(ies|ing|ed|es|s)$/i, "").slice(0, 12);

// ---------- meeting notes ----------
const MONTHS = "jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december";
const DAYS = "monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|tues|wed|thu|thurs|fri|sat|sun";
const DUE_RE = new RegExp(
  `\\b(?:by|before|due(?: on| by)?|on|until|till|latest by|deadline:?)\\s+((?:next\\s+)?(?:today|tomorrow|tonight|eod|eow|end of (?:day|week|month)|this week|next week|${DAYS}|\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MONTHS})\\b|(?:${MONTHS})\\s+\\d{1,2}(?:st|nd|rd|th)?|\\d{1,2}[/.-]\\d{1,2}(?:[/.-]\\d{2,4})?))`,
  "i"
);
const ACTION_RE = /\b(action(?: item)?s?|todo|to-do|to do|will|need(?:s)? to|has to|have to|should|follow[- ]?up|assigned|take care of|send|share|prepare|update|review|schedule|fix|draft|book|set up|reach out|circulate|finalise|finalize|check)\b/i;
const DECISION_RE = /\b(decided|decision|agreed|approved|finali[sz]ed|resolved|going with|go with|chose|signed off|confirmed)\b/i;
const NOT_NAMES = new Set(["We", "The", "This", "That", "All", "Everyone", "Team", "Action", "Todo", "TODO", "Decision", "Note", "Notes", "Next", "Agenda", "Q", "Question", "AI", "It", "They", "He", "She", "I", "Also", "Then", "Please", "Need", "Will", "Should"]);
function findOwner(line) {
  let m = line.match(/@([\p{L}][\p{L}.'-]*)/u);
  if (m) return m[1];
  m = line.match(/^([\p{Lu}][\p{L}'-]+(?:\s[\p{Lu}][\p{L}'-]+)?)\s*(?::|-|–)\s/u);
  if (m && !NOT_NAMES.has(m[1].split(" ")[0])) return m[1];
  m = line.match(/^([\p{Lu}][\p{L}'-]+)\s+(?:will|to|needs to|should|has to|is going to)\b/u);
  if (m && !NOT_NAMES.has(m[1])) return m[1];
  m = line.match(/\((?:owner|assignee)?:?\s*([\p{Lu}][\p{L}'-]+)\)\s*$/u);
  if (m) return m[1];
  m = line.match(/[:\-–]\s*([\p{Lu}][\p{L}'-]+)\s*(?:[-–:]\s*)?(?:will|to|needs? to|should|has to|is going to)\b/u);
  if (m && !NOT_NAMES.has(m[1])) return m[1];
  return "";
}

// ---------- resume bullets ----------
const WEAK = [
  [/^(?:i\s+)?(?:was\s+)?responsible for\s+/i, "Led"],
  [/^(?:i\s+)?(?:was\s+)?in charge of\s+/i, "Managed"],
  [/^(?:i\s+)?worked on\s+/i, "Built"],
  [/^(?:i\s+)?worked with\s+/i, "Partnered with"],
  [/^(?:i\s+)?worked as\s+/i, "Served as"],
  [/^(?:i\s+)?helped(?: to)?\s+/i, "Supported"],
  [/^(?:i\s+)?assisted(?: in| with)?\s+/i, "Supported"],
  [/^(?:i\s+)?(?:was\s+)?involved in\s+/i, "Contributed to"],
  [/^(?:i\s+)?participated in\s+/i, "Contributed to"],
  [/^(?:i\s+)?handled\s+/i, "Managed"],
  [/^(?:i\s+)?did\s+/i, "Executed"],
  [/^(?:i\s+)?(?:was\s+)?tasked with\s+/i, "Owned"],
  [/^duties included\s+/i, "Delivered"],
  [/^(?:i\s+)?made\s+/i, "Created"],
  [/^(?:i\s+)?got\s+/i, "Secured"],
  [/^(?:i\s+)?used\s+/i, "Applied"],
  [/^(?:i\s+)?took part in\s+/i, "Contributed to"],
  [/^(?:i\s+)?looked after\s+/i, "Managed"],
];
const STRONG = new Set(
  "accelerated achieved administered advised analysed analyzed architected automated boosted built championed coached collaborated completed conceived consolidated converted coordinated created cut debugged decreased defined delivered deployed designed developed devised directed doubled drove eliminated enabled engineered established exceeded executed expanded facilitated forecast founded generated grew guided halved headed identified implemented improved increased initiated innovated installed instituted integrated introduced launched led maintained managed mentored migrated modernised modernized monitored negotiated optimised optimized orchestrated organised organized overhauled owned partnered pioneered planned presented prioritised prioritized produced programmed proposed published raised rebuilt recruited redesigned reduced refactored reorganised reorganized resolved restructured revamped saved scaled secured shipped simplified solved spearheaded standardised standardized streamlined strengthened supervised supported tested trained transformed tripled upgraded won wrote contributed served applied audited authored calculated closed configured curated documented edited evaluated handled interviewed investigated mapped measured modelled modeled onboarded operated prepared processed purchased reconciled reported researched reviewed scheduled sold sourced structured surveyed taught tracked translated validated verified visualised visualized".split(" ")
);
const FILLER = ["various", "several", "successfully", "effectively", "efficiently", "very", "really", "etc", "a lot of", "lots of", "hard-working", "hardworking", "team player", "detail-oriented", "go-getter", "synergy", "dynamic", "basically", "actually"];
const VERB_BANK = [
  ["Leading", "Led, Directed, Headed, Spearheaded, Mentored, Coached, Supervised, Orchestrated"],
  ["Building", "Built, Developed, Designed, Engineered, Launched, Created, Implemented, Shipped"],
  ["Improving", "Improved, Optimised, Streamlined, Reduced, Increased, Automated, Accelerated, Revamped"],
  ["Analysing", "Analysed, Identified, Forecast, Evaluated, Measured, Modelled, Researched, Audited"],
  ["Communicating", "Presented, Negotiated, Persuaded, Authored, Trained, Partnered, Advised, Published"],
  ["Results", "Achieved, Exceeded, Generated, Grew, Saved, Won, Secured, Delivered"],
];
const IRREGULAR_ING = { leading: "Led", building: "Built", writing: "Wrote", running: "Ran", making: "Made", selling: "Sold", teaching: "Taught", setting: "Set", overseeing: "Oversaw", driving: "Drove", bringing: "Brought", buying: "Bought", meeting: "Met", winning: "Won", giving: "Gave", taking: "Took", keeping: "Kept", getting: "Got" };
/** "managing" -> "Managed", "planning" -> "Planned", "leading" -> "Led". */
function gerundToPast(w) {
  const l = w.toLowerCase();
  if (IRREGULAR_ING[l]) return IRREGULAR_ING[l];
  let stemW = l.slice(0, -3);
  if (/(at|iz|is|ag|uc|ur|bl|in|om|rv|ov|iv)$/.test(stemW) && !/(ain|oin|ein)$/.test(stemW)) stemW += "e";
  const past = /e$/.test(stemW) ? stemW + "d" : /[^aeiou]y$/.test(stemW) ? stemW.slice(0, -1) + "ied" : stemW + "ed";
  return past.charAt(0).toUpperCase() + past.slice(1);
}
const PRESENT_TO_PAST = { manage: "Managed", lead: "Led", build: "Built", develop: "Developed", design: "Designed", create: "Created", handle: "Managed", work: "Worked", help: "Supported", maintain: "Maintained", write: "Wrote", run: "Ran", drive: "Drove", own: "Owned", coordinate: "Coordinated", prepare: "Prepared", test: "Tested", train: "Trained", support: "Supported", analyse: "Analysed", analyze: "Analyzed", plan: "Planned", oversee: "Oversaw", conduct: "Conducted", implement: "Implemented" };

// ---------- hashtags ----------
const PLATFORMS = {
  instagram: { name: "Instagram", max: 5, note: "Instagram allows up to 5 hashtags per post or Reel." },
  youtube: { name: "YouTube", max: 15, note: "More than 15 hashtags and YouTube ignores all of them; the first 3 show above the title." },
  linkedin: { name: "LinkedIn", max: 5, note: "LinkedIn has no hard limit, but 3 to 5 relevant hashtags work best." },
  x: { name: "X (Twitter)", max: 3, note: "X has no hard limit; 1 or 2 hashtags is typical and every tag uses characters from your 280." },
  tiktok: { name: "TikTok", max: 6, note: "TikTok has no fixed limit beyond the caption length; 3 to 6 focused tags is common." },
};
const camel = (phrase) =>
  phrase
    .split(/[^\p{L}\p{N}_]+/u)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");

// ---------- YouTube ----------
function tsToSec(ts) {
  return ts
    .split(":")
    .map(Number)
    .reduce((a, n) => a * 60 + n, 0);
}

const SAMPLE_ROBOTS = `# robots.txt for example.in
User-agent: *
Disallow: /admin/
Disallow: /cart
Disallow: /*?sort=
Allow: /admin/help/

User-agent: Googlebot-Image
Disallow: /private-images/

User-agent: GPTBot
Disallow: /

Sitemap: https://example.in/sitemap.xml`;

const SAMPLE_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.in/</loc>
    <lastmod>2026-10-14</lastmod>
  </url>
  <url>
    <loc>https://example.in/calculators/emi-calculator</loc>
    <lastmod>2026-10-14T09:30:00+05:30</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>/guides/home-loan-tips</loc>
    <lastmod>14-10-2026</lastmod>
  </url>
  <url>
    <loc>https://example.in/calculators/emi-calculator</loc>
    <changefreq>sometimes</changefreq>
  </url>
</urlset>`;

const SAMPLE_HEAD = `<!doctype html>
<html lang="en">
<head>
  <title>SIP Calculator: Mutual Fund Returns with Step-Up | FreeToolsPro</title>
  <meta name="description" content="Calculate the future value of your monthly SIP with an optional yearly step-up, and see a year-by-year table.">
  <link rel="canonical" href="https://freetoolspro.in/calculators/sip-calculator">
  <meta property="og:type" content="website">
  <meta property="og:title" content="SIP Calculator: Mutual Fund Returns with Step-Up">
  <meta property="og:description" content="See how a monthly SIP grows, with an optional yearly step-up.">
  <meta property="og:url" content="https://freetoolspro.in/calculators/sip-calculator">
  <meta property="og:image" content="https://freetoolspro.in/images/seo-preview.png">
  <meta property="og:site_name" content="FreeToolsPro">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body>…</body>
</html>`;

const SAMPLE_HEADERS = `HTTP/1.1 301 Moved Permanently
Location: https://example.in/
Content-Length: 0

HTTP/2 301
location: https://www.example.in/
cache-control: max-age=3600

HTTP/2 200
content-type: text/html; charset=utf-8
content-encoding: br
cache-control: public, max-age=600
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
server: nginx/1.24.0
x-powered-by: PHP/8.2.1
set-cookie: session=abc123; Path=/; HttpOnly`;

const SAMPLE_ARTICLE = `India's digital payments story is usually told through UPI, but the bigger change is in how small businesses now manage money. A kirana store that once kept a paper ledger can now see every payment, refund and settlement on a phone. That visibility has made it far easier for these shops to get formal credit.

Lenders used to ask for years of audited accounts before approving a working-capital loan. Today many of them look at six to twelve months of UPI and GST data instead. If sales are steady and growing, a shop can get a small loan within days rather than months. The amounts are modest, often between ₹50,000 and ₹5 lakh, but they arrive when the business needs stock for a festival season.

There are risks. Digital lending apps have grown faster than regulation, and some charge hidden fees or use aggressive recovery tactics. The RBI's digital lending guidelines now require lenders to show the full annual percentage rate upfront and to disburse money only into the borrower's own bank account.

For shop owners, the practical advice is simple. Keep business and personal payments in separate accounts, file GST returns on time, and compare the annual percentage rate before accepting any loan offer. A clean digital record is now one of the most valuable assets a small business can have.`;

const SAMPLE_NOTES = `Weekly launch sync - Diwali sale
Attendees: Priya, Rahul, Meera, Arjun

- Landing page is 80% done, hero image pending
- Decided to launch on 28 Oct instead of 25 Oct
- Rahul will finalise the discount codes by Friday
- @Meera to share the email draft with legal by 22 Oct
- Payment gateway load test: Arjun - need to run it before next week
- Agreed: no free shipping below ₹499
- Do we need a separate banner for the app?
- Ad budget approved at ₹2 lakh for the first week
- Priya: update the FAQ page with return policy
- Who owns social media replies during the sale?`;

const SAMPLE_BULLETS = `Responsible for managing the company's social media accounts
Worked on a new checkout page for the website
Helped the team to reduce customer complaints
Increased monthly active users from 40,000 to 65,000 in 6 months by redesigning onboarding
I was involved in various projects related to data analysis
Built automated Excel reports using Python, cutting weekly reporting time from 6 hours to 30 minutes`;

const SAMPLE_YT = `What does a ₹30 lakh home loan EMI really cost you? In this video I break down the monthly EMI, the total interest and the one prepayment trick that can save you lakhs.

📌 Free EMI calculator: https://freetoolspro.in/calculators/emi-calculator

Chapters:
0:00 Intro
0:45 How EMI is calculated
3:10 Total interest over 20 years
6:30 Prepayment: reduce EMI or tenure?
9:05 My recommendation

#HomeLoan #PersonalFinance #EMI`;

const SAMPLE_TAGS = `Diwali sale is live! Big discounts on handmade diyas and gift hampers 🪔
#Diwali #diwali #DiwaliGifts #handmade #HandMade #SmallBusinessIndia #shoplocal #festive #Diwali2026 #MadeInIndia #giftideas #2026 #Diwali_Sale`;

export const EXTRA_TEXTS = {
  // ================= developer =================
  "javascript-minifier": {
    sample: `/*! tiny-utils v1.2 | MIT */
// Format a number in Indian style: 1234567 -> 12,34,567
export function formatINR(value, decimals = 0) {
  const fixed = Number(value).toFixed(decimals);
  const [whole, frac] = fixed.split(".");
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? rest.replace(/\\B(?=(\\d{2})+(?!\\d))/g, ",") + "," + last3 : last3;
  return \`₹\${grouped}\${frac ? "." + frac : ""}\`;
}

/* Debounce: wait until calls stop for \`ms\` milliseconds */
export const debounce = (fn, ms = 250) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}`,
    options: [tog("license", "Keep /*! licence */ comments", true)],
    outputLang: "js",
    run: (t, o) => {
      if (!t.trim()) return { info: "Paste JavaScript to minify." };
      const out = minifyJs(t, { keepLicense: o.license });
      const a = bytesOf(t),
        b = bytesOf(out);
      return { output: out, info: `${kb(a)} → ${kb(b)} (${a ? Math.round((1 - b / a) * 100) : 0}% smaller)`, download: { name: "script.min.js", mime: "text/javascript" } };
    },
  },

  // ================= SEO =================
  "robots-txt-tester": {
    sample: SAMPLE_ROBOTS,
    inputLabel: "robots.txt",
    input2Label: "URLs or paths to test (one per line)",
    sample2: "https://example.in/admin/settings\nhttps://example.in/admin/help/faq\n/products?sort=price\n/cart\n/offers/diwali\n/private-images/logo.png",
    options: [
      sel("ua", "Crawler", "googlebot", [
        ["googlebot", "Googlebot"],
        ["googlebot-image", "Googlebot-Image"],
        ["googlebot-news", "Googlebot-News"],
        ["bingbot", "Bingbot"],
        ["gptbot", "GPTBot (OpenAI)"],
        ["google-extended", "Google-Extended (Gemini training)"],
        ["ccbot", "CCBot (Common Crawl)"],
        ["custom", "Other user agent…"],
      ]),
      { ...txt("custom", "User-agent token", "", "e.g. AhrefsBot"), show: (o) => o.ua === "custom" },
    ],
    run: (t, o, t2) => {
      if (!t.trim()) return { info: "Paste the contents of a robots.txt file." };
      const parsed = parseRobots(t);
      const ua = o.ua === "custom" ? (o.custom || "*").trim().toLowerCase() : o.ua;
      const paths = (t2 || "").split(/\r?\n/).map(toPath).filter(Boolean);
      const rows = paths.map((p) => {
        const v = robotsVerdict(parsed, ua, p);
        return [p, v.allowed ? "✓ Allowed" : "✕ Blocked", v.rule];
      });
      const group = paths.length ? robotsVerdict(parsed, ua, "/").agent : "";
      const checks = [...parsed.issues];
      if (!parsed.groups.length) checks.unshift(bad("No User-agent groups found", "Every set of rules needs a 'User-agent:' line above it."));
      if (!parsed.sitemaps.length) checks.push(warn("No Sitemap line", "Add 'Sitemap: https://yoursite.com/sitemap.xml' so crawlers find your sitemap."));
      const everything = parsed.groups.find((g) => g.agents.includes("*") && g.rules.some((r) => r.type === "disallow" && r.path === "/"));
      if (everything) checks.push(bad("'Disallow: /' for all crawlers", "This blocks your whole site from every search engine. Remove it unless the site is private."));
      if (bytesOf(t) > 500 * 1024) checks.push(bad("File is larger than 500 KiB", "Google ignores anything after the first 500 KiB."));
      if (!checks.some((c) => c.status === "bad")) checks.unshift(ok("No blocking errors found"));
      return {
        stats: [
          { label: "Groups", value: fmtN(parsed.groups.length) },
          { label: "Rules", value: fmtN(parsed.groups.reduce((a, g) => a + g.rules.length, 0)) },
          { label: "Sitemaps", value: fmtN(parsed.sitemaps.length) },
          { label: "Group used", value: group ? (group === "*" ? "User-agent: *" : `User-agent: ${group}`) : "—" },
          { label: "Blocked", value: fmtN(rows.filter((r) => r[1].startsWith("✕")).length), warn: rows.some((r) => r[1].startsWith("✕")) },
        ],
        table: rows.length ? { cols: ["URL path", "Result", "Deciding rule"], rows } : undefined,
        checks,
      };
    },
  },

  "sitemap-validator": {
    sample: SAMPLE_SITEMAP,
    inputLabel: "sitemap.xml",
    clientOnly: true,
    options: [],
    run: (t) => {
      if (!t.trim()) return { info: "Paste a sitemap or sitemap index, or open the file." };
      if (typeof DOMParser === "undefined") return null;
      const doc = new DOMParser().parseFromString(t.trim(), "application/xml");
      const perr = doc.getElementsByTagName("parsererror")[0];
      if (perr) {
        const why = (perr.querySelector("div")?.textContent || perr.textContent).replace(/\s+/g, " ").replace(/Below is a rendering.*$/i, "").replace(/^This page contains the following errors:\s*/i, "").trim();
        return { error: `The XML is not well-formed: ${why.slice(0, 220)}` };
      }
      const root = doc.documentElement;
      const kind = root.localName;
      const checks = [];
      if (kind !== "urlset" && kind !== "sitemapindex") return { error: `The root element is <${root.nodeName}>. A sitemap must start with <urlset> or <sitemapindex>.` };
      const NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
      if (root.namespaceURI !== NS) checks.push(bad("Missing or wrong sitemap namespace", `Use xmlns="${NS}" on <${kind}>.`));
      const items = [...root.children].filter((c) => c.localName === (kind === "urlset" ? "url" : "sitemap"));
      const child = (el, n) => [...el.children].find((c) => c.localName === n);
      const problems = [];
      const seen = new Map();
      const hosts = new Map();
      const W3C = /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?)?)?$/;
      const FREQ = new Set(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]);
      const urls = [];
      items.forEach((it, i) => {
        const n = i + 1;
        const locEl = child(it, "loc");
        const loc = locEl?.textContent.trim();
        if (!loc) return problems.push([n, "—", "Missing <loc>"]);
        urls.push(loc);
        if (!isAbs(loc)) problems.push([n, loc, "URL must be absolute (start with https://)"]);
        else {
          try {
            const u = new URL(loc);
            hosts.set(u.host, (hosts.get(u.host) || 0) + 1);
            if (u.hash) problems.push([n, loc, "Remove the #fragment; search engines ignore it"]);
            if (u.protocol === "http:") problems.push([n, loc, "Uses http://; list the https:// version if your site has one"]);
          } catch {
            problems.push([n, loc, "Not a valid URL"]);
          }
        }
        if (/\s/.test(loc)) problems.push([n, loc, "Contains spaces; encode them as %20"]);
        if (loc.length > 2048) problems.push([n, loc.slice(0, 60) + "…", "Longer than 2,048 characters"]);
        if (seen.has(loc)) problems.push([n, loc, `Duplicate of entry ${seen.get(loc)}`]);
        else seen.set(loc, n);
        const lm = child(it, "lastmod")?.textContent.trim();
        if (lm !== undefined && !W3C.test(lm)) problems.push([n, loc, `lastmod '${lm}' is not in W3C format (YYYY-MM-DD)`]);
        if (lm && W3C.test(lm) && Date.parse(lm) > Date.now() + 864e5) problems.push([n, loc, `lastmod ${lm} is in the future`]);
        const cf = child(it, "changefreq")?.textContent.trim();
        if (cf !== undefined && !FREQ.has(cf.toLowerCase())) problems.push([n, loc, `changefreq '${cf}' is not a valid value`]);
        const pr = child(it, "priority")?.textContent.trim();
        if (pr !== undefined && !(/^(0(\.\d+)?|1(\.0+)?)$/.test(pr))) problems.push([n, loc, `priority '${pr}' must be between 0.0 and 1.0`]);
      });
      if (!items.length) checks.push(bad(`No <${kind === "urlset" ? "url" : "sitemap"}> entries found`));
      if (items.length > 50000) checks.push(bad(`${fmtN(items.length)} entries; the limit is 50,000`, "Split into several sitemaps and list them in a sitemap index."));
      const size = bytesOf(t);
      if (size > 50 * 1048576) checks.push(bad(`File is ${kb(size)}; the limit is 50 MB uncompressed`));
      if (hosts.size > 1) checks.push(warn(`URLs use ${hosts.size} different hosts`, [...hosts.keys()].join(", ") + ". A sitemap should normally list URLs from one host only."));
      if (kind === "urlset" && items.some((it) => child(it, "priority") || child(it, "changefreq"))) checks.push(info("priority and changefreq are ignored by Google", "They do no harm, but only an accurate lastmod is used."));
      if (!problems.length && !checks.some((c) => c.status === "bad")) checks.unshift(ok("Valid sitemap", `${fmtN(items.length)} ${kind === "urlset" ? "URLs" : "sitemaps"} checked; no errors found.`));
      else if (problems.length) checks.unshift(bad(`${fmtN(problems.length)} problem${problems.length === 1 ? "" : "s"} in entries`, "See the table below."));
      return {
        stats: [
          { label: "Type", value: kind === "urlset" ? "URL sitemap" : "Sitemap index" },
          { label: kind === "urlset" ? "URLs" : "Sitemaps", value: fmtN(items.length) },
          { label: "Unique", value: fmtN(seen.size) },
          { label: "Problems", value: fmtN(problems.length), warn: problems.length > 0 },
          { label: "File size", value: kb(size) },
        ],
        checks,
        table: problems.length ? { cols: ["Entry", "URL", "Problem"], rows: problems.slice(0, 500) } : undefined,
        outputs: urls.length ? [{ label: `All ${fmtN(urls.length)} URLs`, value: urls.join("\n") }] : undefined,
      };
    },
  },

  "open-graph-preview": {
    sample: SAMPLE_HEAD,
    inputLabel: "Page HTML (or just the <head>)",
    options: [],
    run: (t) => {
      if (!t.trim()) return { info: "Paste the HTML of your page. In Chrome: right-click the page, View page source, copy all." };
      const h = parseHead(t);
      const ogUrl = h.meta("og:url");
      const canonical = h.links.find((l) => (l.rel || "").toLowerCase().split(/\s+/).includes("canonical"))?.href;
      const base = isAbs(ogUrl) ? ogUrl : isAbs(canonical) ? canonical : undefined;
      const title = h.meta("og:title") ?? h.meta("twitter:title") ?? h.title ?? "";
      const desc = h.meta("og:description") ?? h.meta("twitter:description") ?? h.meta("description") ?? "";
      const rawImg = h.meta("og:image") ?? h.meta("og:image:url") ?? h.meta("twitter:image") ?? "";
      const img = rawImg ? absolute(rawImg, base) : "";
      let host = "";
      try {
        host = new URL(base || img || "https://example.com").hostname;
      } catch {}
      const site = h.meta("og:site_name") || host;
      const card = h.meta("twitter:card") || (img ? "summary" : "");
      const checks = [];
      const need = (k, label, max, tip) => {
        const v = h.meta(k);
        if (v === undefined) checks.push(bad(`${k} missing`, tip));
        else if (!v.trim()) checks.push(bad(`${k} is empty`, tip));
        else if (max && chars(v) > max) checks.push(warn(`${k} is ${chars(v)} characters`, `${label} longer than about ${max} characters is cut off on most apps.`));
        else checks.push(ok(`${k}`, v.length > 90 ? v.slice(0, 90) + "…" : v));
      };
      need("og:title", "Titles", 70, "The headline shown in every link preview. Without it apps fall back to <title>.");
      need("og:description", "Descriptions", 200, "One or two sentences shown under the title on Facebook, LinkedIn and WhatsApp.");
      if (!rawImg) checks.push(bad("og:image missing", "Links without an image get a small, plain preview. Use a 1200 × 630 image."));
      else if (!isAbs(rawImg)) checks.push(bad("og:image is a relative URL", `Use a full URL such as ${img || "https://yoursite.com/og.png"}. Apps cannot resolve relative paths.`));
      else if (/^http:/i.test(rawImg)) checks.push(warn("og:image uses http://", "Some apps refuse insecure images. Use https://."));
      else checks.push(ok("og:image", rawImg));
      if (rawImg && !(h.meta("og:image:width") && h.meta("og:image:height"))) checks.push(info("og:image:width and og:image:height not set", "Adding them lets Facebook and LinkedIn show the image on the first share instead of after a delay."));
      if (rawImg && !h.meta("og:image:alt")) checks.push(info("og:image:alt not set", "Alt text describes the image to people using screen readers."));
      if (!ogUrl) checks.push(warn("og:url missing", "The canonical address of the page; shares and likes are counted against it."));
      else if (canonical && absolute(canonical) !== absolute(ogUrl)) checks.push(warn("og:url differs from the canonical URL", `og:url ${ogUrl} vs canonical ${canonical}`));
      else checks.push(ok("og:url", ogUrl));
      if (!h.meta("og:type")) checks.push(info("og:type not set", "Defaults to 'website'. Use 'article' for articles and news posts."));
      if (!h.meta("og:site_name")) checks.push(info("og:site_name not set", "Shown above the title on Facebook and some chat apps."));
      if (!h.meta("twitter:card")) checks.push(warn("twitter:card missing", "Without it X shows a small card. Add <meta name=\"twitter:card\" content=\"summary_large_image\">."));
      else checks.push(ok(`twitter:card = ${card}`));
      const outside = h.metas.filter((m) => !m._inHead && /^(og:|twitter:)/i.test(m.property || m.name || ""));
      if (outside.length) checks.push(bad(`${outside.length} social tag${outside.length === 1 ? " is" : "s are"} outside <head>`, "Crawlers only read meta tags inside the head."));

      const large = card === "summary_large_image";
      const imgTag = (cls) => (img ? `<div class="${cls}" style="background-image:url('${esc(img)}')"></div>` : `<div class="${cls} noimg">No image</div>`);
      const html = `<style>
*{box-sizing:border-box}body{margin:12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1c1e21;background:#f5f6f8}
h3{font:600 12px/1 system-ui;margin:18px 0 8px;color:#606770;text-transform:uppercase;letter-spacing:.06em}h3:first-child{margin-top:0}
.cardimg,.ximg,.liimg,.waimg{background:#dfe3e8 center/cover no-repeat}.noimg{display:flex;align-items:center;justify-content:center;color:#8a94a6;font-size:13px}
.fb{max-width:500px;border:1px solid #dadde1;background:#f2f3f5}.fb .cardimg{aspect-ratio:1.91/1}.fb .b{padding:10px 12px}.fb .h{font-size:12px;color:#606770;text-transform:uppercase}.fb .t{font-weight:600;font-size:16px;margin:3px 0;line-height:1.25;max-height:2.5em;overflow:hidden}.fb .d{font-size:14px;color:#606770;line-height:1.3;max-height:1.3em;overflow:hidden}
.x{max-width:500px;border:1px solid #cfd9de;border-radius:16px;overflow:hidden;background:#fff;position:relative}.x .ximg{aspect-ratio:1.91/1}.x .dom{position:absolute;left:12px;bottom:12px;background:rgba(0,0,0,.77);color:#fff;font-size:13px;padding:1px 6px;border-radius:4px}
.xs{display:flex;max-width:500px;border:1px solid #cfd9de;border-radius:16px;overflow:hidden;background:#fff}.xs .ximg{width:130px;flex:none;aspect-ratio:1}.xs .b{padding:12px;font-size:15px;color:#536471}.xs .t{color:#0f1419}
.li{max-width:500px;background:#fff;border:1px solid #e0dfdc;display:flex;gap:12px;padding:12px;border-radius:8px}.li .liimg{width:128px;flex:none;aspect-ratio:1.91/1;border-radius:6px}.li .t{font-weight:600;font-size:14px;line-height:1.3}.li .h{font-size:12px;color:#666;margin-top:4px}
.wa{max-width:360px;background:#d9fdd3;border-radius:8px;padding:4px;box-shadow:0 1px .5px rgba(0,0,0,.13)}.wa .in{background:#cbedc5;border-radius:6px;overflow:hidden}.wa .waimg{aspect-ratio:1.91/1}.wa .b{padding:6px 8px}.wa .t{font-weight:600;font-size:14px}.wa .d{font-size:13px;color:#54656f;max-height:2.6em;overflow:hidden}.wa .h{font-size:12px;color:#667781}.wa .link{padding:6px 6px 2px;font-size:14px;color:#027eb5;word-break:break-all}
</style>
<h3>Facebook</h3><div class="fb">${imgTag("cardimg")}<div class="b"><div class="h">${esc(host)}</div><div class="t">${esc(title)}</div><div class="d">${esc(desc)}</div></div></div>
<h3>X (Twitter)</h3>${large ? `<div class="x">${imgTag("ximg")}<span class="dom">${esc(host)}</span></div><div style="font-size:13px;color:#536471;margin-top:4px">From ${esc(host)}: ${esc(title)}</div>` : `<div class="xs">${imgTag("ximg")}<div class="b">${esc(host)}<div class="t">${esc(title)}</div>${esc(desc.slice(0, 90))}</div></div>`}
<h3>LinkedIn</h3><div class="li">${imgTag("liimg")}<div><div class="t">${esc(title)}</div><div class="h">${esc(host)}</div></div></div>
<h3>WhatsApp</h3><div class="wa"><div class="in">${imgTag("waimg")}<div class="b"><div class="t">${esc(title)}</div><div class="d">${esc(desc)}</div><div class="h">${esc(host)}</div></div></div><div class="link">${esc(base || "https://" + host)}</div></div>`;
      const missing = [];
      const add = (k, v, attr = "property") => h.meta(k) === undefined && missing.push(`<meta ${attr}="${k}" content="${esc(v)}">`);
      add("og:title", title || "Page title");
      add("og:description", desc || "One or two sentences about the page.");
      add("og:url", base || "https://yoursite.com/page");
      add("og:type", "website");
      if (!rawImg) add("og:image", "https://yoursite.com/og/page.png");
      if (rawImg && !h.meta("og:image:width")) missing.push(`<meta property="og:image:width" content="1200">`, `<meta property="og:image:height" content="630">`);
      add("og:site_name", site || "Your site");
      add("twitter:card", "summary_large_image", "name");
      return {
        stats: [
          { label: "Title", value: title ? `${chars(title)} chars` : "—", warn: !title },
          { label: "Description", value: desc ? `${chars(desc)} chars` : "—", warn: !desc },
          { label: "Image", value: img ? "Found" : "Missing", warn: !img },
          { label: "Card type", value: card || "—" },
        ],
        checks,
        outputs: missing.length ? [{ label: "Tags to add", value: missing.join("\n") }] : undefined,
        html,
        htmlHeight: large ? 1240 : 1060,
      };
    },
  },

  "canonical-checker": {
    sample: SAMPLE_HEAD.replace('<link rel="canonical" href="https://freetoolspro.in/calculators/sip-calculator">', '<link rel="canonical" href="/calculators/sip-calculator">\n  <meta name="robots" content="index, follow">'),
    inputLabel: "Page HTML (view source and paste)",
    options: [txt("page", "Page URL (the address you checked)", "https://freetoolspro.in/calculators/sip-calculator?utm_source=whatsapp", "https://example.com/page")],
    run: (t, o) => {
      if (!t.trim()) return { info: "Paste the page's HTML source." };
      const h = parseHead(t);
      const page = (o.page || "").trim();
      const pageUrl = isAbs(page) ? new URL(page) : null;
      const cans = h.links.filter((l) => (l.rel || "").toLowerCase().split(/\s+/).includes("canonical"));
      const checks = [];
      let resolved = "";
      if (page && !pageUrl) checks.push(warn("Page URL is not a full URL", "Include https:// so relative canonicals can be resolved."));
      if (!cans.length) checks.push(bad("No canonical tag found", 'Add <link rel="canonical" href="https://yoursite.com/this-page"> inside <head>.'));
      else {
        if (cans.length > 1) {
          const distinct = new Set(cans.map((c) => absolute(c.href || "", pageUrl?.href)));
          checks.push(bad(`${cans.length} canonical tags found`, distinct.size > 1 ? "They point to different URLs, so Google may ignore all of them. Keep exactly one." : "Keep exactly one; duplicates are often added by a theme plus an SEO plugin."));
        }
        const c = cans[0];
        const href = (c.href || "").trim();
        if (!href) checks.push(bad("Canonical tag has no href"));
        else {
          resolved = absolute(href, pageUrl?.href) || href;
          if (!isAbs(href)) checks.push(warn("Canonical URL is relative", `Resolved to ${resolved}. Use the full absolute URL to avoid mistakes.`));
          else checks.push(ok("Canonical URL is absolute", href));
          if (!c._inHead) checks.push(bad("Canonical tag is outside <head>", "Google ignores rel=canonical in the body."));
          try {
            const cu = new URL(resolved);
            if (cu.hash) checks.push(warn("Canonical contains a #fragment", "Fragments are ignored; remove it."));
            if ([...cu.searchParams.keys()].some((k) => /^(utm_|gclid|fbclid|ref$|source$)/i.test(k))) checks.push(bad("Canonical contains tracking parameters", "Point the canonical at the clean URL without utm_ or click IDs."));
            if (pageUrl) {
              if (cu.protocol !== pageUrl.protocol) checks.push(warn(`Protocol differs: canonical is ${cu.protocol.replace(":", "")}, page is ${pageUrl.protocol.replace(":", "")}`));
              if (cu.host.replace(/^www\./, "") !== pageUrl.host.replace(/^www\./, "")) checks.push(warn("Canonical points to a different domain", `${cu.host} vs ${pageUrl.host}. Fine for syndicated content; otherwise check it.`));
              else if (cu.host !== pageUrl.host) checks.push(warn("www and non-www differ", `${cu.host} vs ${pageUrl.host}. Make sure one redirects to the other.`));
              const clean = new URL(pageUrl.href);
              [...clean.searchParams.keys()].filter((k) => /^(utm_|gclid|fbclid)/i.test(k)).forEach((k) => clean.searchParams.delete(k));
              clean.hash = "";
              const norm = (u) => u.href.replace(/\/$/, "").toLowerCase();
              if (norm(cu) === norm(clean)) checks.push(ok("Self-referencing canonical", pageUrl.search !== clean.search ? "Matches this page once tracking parameters are removed, which is what you want." : "The page points to itself."));
              else if (cu.pathname.replace(/\/$/, "") === pageUrl.pathname.replace(/\/$/, "") && cu.host === pageUrl.host) checks.push(info("Canonical drops some query parameters", `Parameters ${pageUrl.search} are not in the canonical. Correct for filters and sorting; check it is not dropping real content.`));
              else checks.push(warn("Canonical points to another page", `This page asks search engines to index ${resolved} instead. Correct for duplicates; wrong if this page has unique content.`));
            }
          } catch {
            checks.push(bad("Canonical href is not a valid URL", href));
          }
        }
      }
      const robots = (h.meta("robots") || "") + " " + (h.meta("googlebot") || "");
      if (/noindex/i.test(robots)) checks.push(cans.length && resolved && pageUrl && resolved.replace(/\/$/, "") !== pageUrl.href.replace(/\/$/, "") ? bad("noindex plus a canonical to another URL", "Mixed signals: use noindex or a canonical, not both.") : warn("Page is set to noindex", "It will be dropped from search results regardless of the canonical."));
      const ogUrl = h.meta("og:url");
      if (ogUrl && resolved && absolute(ogUrl) !== absolute(resolved)) checks.push(warn("og:url differs from the canonical", `${ogUrl}`));
      const alts = h.links.filter((l) => (l.rel || "").toLowerCase() === "alternate" && l.hreflang);
      if (alts.length) checks.push(info(`${alts.length} hreflang alternate${alts.length === 1 ? "" : "s"} found`, "Each language version should have a self-referencing canonical, not one pointing to the main language."));
      return {
        stats: [
          { label: "Canonical", value: resolved || "None", warn: !resolved },
          { label: "Tags found", value: String(cans.length), warn: cans.length !== 1 },
          { label: "Robots", value: robots.trim() || "Not set (index)" },
        ],
        checks,
      };
    },
  },

  "http-header-checker": {
    sample: SAMPLE_HEADERS,
    inputLabel: "Response headers (curl -sIL output or copied from DevTools)",
    options: [],
    run: (t) => {
      if (!t.trim()) return { info: "Paste response headers. Run: curl -sIL https://yoursite.com" };
      const blocks = parseHeaderBlocks(t);
      if (!blocks.length) return { error: "No headers found. Paste lines like 'HTTP/2 200' and 'content-type: text/html'." };
      const chainRows = blocks.map((b, i) => {
        const loc = b.headers.find(([k]) => k === "location")?.[1] || "";
        return [i + 1, b.status ?? "?", STATUS[b.status] || b.reason || "", loc];
      });
      const last = blocks[blocks.length - 1];
      const H = new Map();
      for (const [k, v] of last.headers) H.set(k, H.has(k) ? H.get(k) + "\n" + v : v);
      const checks = [];
      const redirects = blocks.filter((b) => b.status >= 300 && b.status < 400 && b.status !== 304);
      if (redirects.length === 0) checks.push(ok("No redirects"));
      else {
        const temp = redirects.filter((b) => [302, 303, 307].includes(b.status));
        checks.push((redirects.length > 2 ? warn : ok)(`${redirects.length} redirect${redirects.length === 1 ? "" : "s"} before the final response`, redirects.length > 2 ? "Each hop adds delay. Redirect straight to the final URL." : "A short chain is fine."));
        if (temp.length) checks.push(warn(`${temp.length} temporary redirect${temp.length === 1 ? "" : "s"} (${[...new Set(temp.map((b) => b.status))].join(", ")})`, "If the move is permanent, use 301 or 308 so search engines transfer ranking to the new URL."));
        const locs = redirects.map((b) => b.headers.find(([k]) => k === "location")?.[1]).filter(Boolean);
        if (new Set(locs).size < locs.length) checks.push(bad("Redirect loop", "The same Location appears twice in the chain."));
        if (redirects.some((b) => !b.headers.some(([k]) => k === "location"))) checks.push(bad("Redirect without a Location header"));
      }
      if (last.status >= 400) checks.push(bad(`Final status ${last.status} ${STATUS[last.status] || ""}`, last.status === 404 ? "Search engines drop 404 pages. Redirect the URL if the content moved." : "Visitors and crawlers get an error page."));
      else if (last.status >= 300 && last.status < 400) checks.push(warn(`Chain ends on a redirect (${last.status})`, "Add -L to curl to follow redirects to the final page."));
      else if (last.status) checks.push(ok(`Final status ${last.status} ${STATUS[last.status] || ""}`));
      const hsts = H.get("strict-transport-security");
      if (!hsts) checks.push(warn("Strict-Transport-Security missing", "Tells browsers to always use HTTPS. Add: max-age=31536000; includeSubDomains"));
      else {
        const age = +(hsts.match(/max-age=(\d+)/i) || [])[1] || 0;
        checks.push(age >= 15768000 ? ok("Strict-Transport-Security", hsts) : warn("HSTS max-age is short", `${hsts}. Use at least 31536000 (one year).`));
      }
      const csp = H.get("content-security-policy");
      checks.push(csp ? ok("Content-Security-Policy", csp.length > 120 ? csp.slice(0, 120) + "…" : csp) : warn("Content-Security-Policy missing", "Limits where scripts and other resources can load from, which blocks most XSS attacks."));
      checks.push(/nosniff/i.test(H.get("x-content-type-options") || "") ? ok("X-Content-Type-Options: nosniff") : warn("X-Content-Type-Options missing", "Add: X-Content-Type-Options: nosniff"));
      const frame = H.get("x-frame-options") || (/frame-ancestors/i.test(csp || "") ? "CSP frame-ancestors" : "");
      checks.push(frame ? ok("Clickjacking protection", frame) : warn("No clickjacking protection", "Add X-Frame-Options: SAMEORIGIN or CSP frame-ancestors 'self'."));
      checks.push(H.get("referrer-policy") ? ok("Referrer-Policy", H.get("referrer-policy")) : info("Referrer-Policy not set", "Browsers default to strict-origin-when-cross-origin, which is usually fine."));
      if (H.get("permissions-policy")) checks.push(ok("Permissions-Policy", H.get("permissions-policy").slice(0, 100)));
      const ct = H.get("content-type");
      if (!ct) checks.push(warn("Content-Type missing"));
      else if (/text\/html/i.test(ct) && !/charset/i.test(ct)) checks.push(warn("Content-Type has no charset", "Use text/html; charset=utf-8."));
      else checks.push(ok("Content-Type", ct));
      const enc = H.get("content-encoding");
      if (enc) checks.push(ok(`Compressed with ${enc}`));
      else if (/text|json|javascript|xml|svg/i.test(ct || "")) checks.push(warn("No compression", "Enable gzip or Brotli on the server; text usually shrinks by 70% or more. (curl only shows it if you add --compressed.)"));
      const cc = H.get("cache-control");
      checks.push(cc ? info("Cache-Control", cc) : warn("Cache-Control missing", "Without it browsers and CDNs guess how long to cache the page."));
      const xr = H.get("x-robots-tag");
      if (xr && /noindex/i.test(xr)) checks.push(bad("X-Robots-Tag: noindex", "This header keeps the page out of search results."));
      for (const k of ["server", "x-powered-by", "x-aspnet-version"]) {
        const v = H.get(k);
        if (v && /\d/.test(v)) checks.push(warn(`${k} reveals a version`, `${v}. Hide version numbers so attackers cannot look up known bugs.`));
      }
      const cookies = (H.get("set-cookie") || "").split("\n").filter(Boolean);
      for (const c of cookies) {
        const name = c.split("=")[0];
        const miss = ["Secure", "HttpOnly", "SameSite"].filter((f) => !new RegExp(`;\\s*${f}`, "i").test(c));
        if (miss.length) checks.push(warn(`Cookie '${name}' lacks ${miss.join(", ")}`, "Session cookies should be Secure, HttpOnly and SameSite=Lax or Strict."));
      }
      const sec = ["strict-transport-security", "content-security-policy", "x-content-type-options", "referrer-policy", "permissions-policy"].filter((k) => H.has(k)).length + (frame ? 1 : 0);
      return {
        stats: [
          { label: "Final status", value: last.status ? String(last.status) : "?", warn: !(last.status >= 200 && last.status < 300) },
          { label: "Redirects", value: String(redirects.length), warn: redirects.length > 2 },
          { label: "Security headers", value: `${sec} of 6`, warn: sec < 4 },
          { label: "Headers (final)", value: String(last.headers.length) },
        ],
        tables: [{ title: "Response chain", cols: ["#", "Status", "Meaning", "Location"], rows: chainRows }],
        checks,
      };
    },
  },

  // ================= writing =================
  "text-summarizer": {
    sample: SAMPLE_ARTICLE,
    options: [
      sel("len", "Summary length", "30", [
        ["20", "Short (about 20%)"],
        ["30", "Medium (about 30%)"],
        ["50", "Long (about 50%)"],
        ["n", "Exact number of sentences"],
      ]),
      { ...numo("n", "Sentences", 3, 1, 50), show: (o) => o.len === "n" },
      sel("fmt", "Format", "para", [
        ["para", "Paragraph"],
        ["bullets", "Bullet points"],
      ]),
    ],
    run: (t, o) => {
      const sents = splitSentences(t);
      if (sents.length < 3) return { info: "Paste at least three sentences of text to summarise." };
      const freq = new Map();
      const tokens = sents.map((s) => wordList(s.text.toLowerCase()).filter((w) => !STOP.has(w) && w.length > 2 && !/^\d+$/.test(w)).map(stem));
      tokens.flat().forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
      const max = Math.max(1, ...freq.values());
      const scored = sents.map((s, i) => {
        const tk = tokens[i];
        const words = wordList(s.text).length;
        let score = tk.length ? tk.reduce((a, w) => a + freq.get(w) / max, 0) / Math.sqrt(tk.length) : 0;
        if (i === 0) score *= 1.25;
        else if (s.first) score *= 1.1;
        if (words < 6) score *= 0.6;
        if (words > 45) score *= 0.85;
        if (/\d/.test(s.text)) score *= 1.05;
        return { ...s, score };
      });
      const k = o.len === "n" ? Math.min(sents.length, Math.max(1, o.n | 0)) : Math.max(1, Math.round((sents.length * Number(o.len)) / 100));
      const pick = [...scored].sort((a, b) => b.score - a.score).slice(0, k).sort((a, b) => a.i - b.i);
      const output = o.fmt === "bullets" ? pick.map((s) => `• ${s.text}`).join("\n") : pick.map((s) => s.text).join(" ");
      const before = wordList(t).length;
      const after = wordList(output).length;
      const keywords = [...freq].sort((a, b) => b[1] - a[1]).slice(0, 8);
      const kwOut = keywords.map(([w]) => {
        const full = wordList(t.toLowerCase()).find((x) => stem(x) === w) || w;
        return full;
      });
      return {
        output,
        stats: [
          { label: "Sentences", value: `${pick.length} of ${sents.length}` },
          { label: "Words", value: `${fmtN(after)} of ${fmtN(before)}` },
          { label: "Shorter by", value: `${before ? Math.round((1 - after / before) * 100) : 0}%` },
          { label: "Key terms", value: kwOut.slice(0, 4).join(", ") || "—" },
        ],
      };
    },
  },

  "meeting-notes-organizer": {
    sample: SAMPLE_NOTES,
    inputLabel: "Rough meeting notes",
    options: [
      txt("title", "Meeting title (optional)", "", "Taken from the first line if left blank"),
      sel("fmt", "Action items as", "table", [
        ["table", "Table"],
        ["checklist", "Checklist"],
      ]),
      tog("notes", "Include other notes", true),
    ],
    run: (t, o) => {
      const raw = t.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (!raw.length) return { info: "Paste your notes, one point per line." };
      let title = (o.title || "").trim();
      let attendees = [];
      const decisions = [],
        actions = [],
        questions = [],
        notes = [];
      raw.forEach((line, idx) => {
        let l = line.replace(/^(?:[-*•▪◦·]|\d+[.)]|\[\s?[xX ]?\s?\])\s*/, "").replace(/^\d{1,2}:\d{2}\s*(?:am|pm)?\s*[-–:]?\s*/i, "");
        const att = l.match(/^(?:attendees|present|participants|people|attendance)\s*[:\-–]\s*(.+)$/i);
        if (att) {
          attendees = att[1].split(/\s*(?:,|;|\band\b|&)\s*/).filter(Boolean);
          return;
        }
        if (idx === 0 && !title && !/[.?!:]$/.test(l) && l.split(" ").length <= 10 && !ACTION_RE.test(l) && !DECISION_RE.test(l)) {
          title = l;
          return;
        }
        if (/^(agenda|date|time|location|venue)\s*[:\-–]/i.test(l)) {
          notes.push(l);
          return;
        }
        const explicitAction = /^(?:action(?: item)?|ai|todo|to-do|task)\s*[:\-–]\s*/i;
        const explicitDecision = /^(?:decision|decided|agreed)\s*[:\-–]\s*/i;
        const explicitQ = /^(?:q|question|open|tbd|parking lot)\s*[:\-–]\s*/i;
        if (explicitQ.test(l) || (/\?\s*$/.test(l) && !explicitAction.test(l))) {
          questions.push(l.replace(explicitQ, ""));
          return;
        }
        if (explicitDecision.test(l) || (DECISION_RE.test(l) && !explicitAction.test(l) && !/@/.test(l))) {
          decisions.push(l.replace(explicitDecision, "").replace(/^\w/, (c) => c.toUpperCase()));
          return;
        }
        if (explicitAction.test(l) || /@[\p{L}]/u.test(l) || ACTION_RE.test(l)) {
          const body = l.replace(explicitAction, "");
          const owner = findOwner(body);
          const due = (body.match(DUE_RE) || [])[1] || "";
          let task = body
            .replace(/@[\p{L}][\p{L}.'-]*\s*(?:to\s+|will\s+|needs to\s+)?/u, "")
            .replace(owner ? new RegExp(`(^|[:\\-–]\\s*)${owner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(?::|-|–)?\\s*(?:will|to|needs? to|should|has to|is going to)?\\s*`) : /^$/, "$1")
            .replace(/\((?:owner|assignee)?:?\s*[\p{Lu}][\p{L}'-]+\)\s*$/u, "")
            .replace(due ? DUE_RE : /^$/, "")
            .replace(/\s*[-–:]\s*(?:need(?:s)? to|will)\s+/i, " – ")
            .replace(/\s{2,}/g, " ")
            .replace(/[\s,;–-]+$/, "")
            .trim();
          task = task.replace(/^\w/, (c) => c.toUpperCase());
          actions.push({ task, owner, due });
          return;
        }
        notes.push(l);
      });
      if (!title) title = "Meeting notes";
      const md = [`# ${title}`, ""];
      if (attendees.length) md.push(`**Attendees:** ${attendees.join(", ")}`, "");
      md.push("## Decisions", ...(decisions.length ? decisions.map((d) => `- ${d}`) : ["- None recorded"]), "");
      md.push("## Action items");
      if (!actions.length) md.push("- None recorded");
      else if (o.fmt === "table") {
        md.push("| # | Task | Owner | Due |", "|---|---|---|---|");
        actions.forEach((a, i) => md.push(`| ${i + 1} | ${a.task.replace(/\|/g, "\\|")} | ${a.owner || "—"} | ${a.due || "—"} |`));
      } else actions.forEach((a) => md.push(`- [ ] ${a.task}${a.owner ? ` — **${a.owner}**` : ""}${a.due ? ` (due ${a.due})` : ""}`));
      md.push("");
      md.push("## Open questions", ...(questions.length ? questions.map((q) => `- ${q}`) : ["- None"]), "");
      if (o.notes && notes.length) md.push("## Notes", ...notes.map((n) => `- ${n}`), "");
      const tasks = actions.map((a) => `${a.task}${a.owner ? ` — ${a.owner}` : ""}${a.due ? ` (by ${a.due})` : ""}`).join("\n");
      return {
        stats: [
          { label: "Decisions", value: String(decisions.length) },
          { label: "Action items", value: String(actions.length) },
          { label: "Without owner", value: String(actions.filter((a) => !a.owner).length), warn: actions.some((a) => !a.owner) },
          { label: "Open questions", value: String(questions.length), warn: questions.length > 0 },
        ],
        output: md.join("\n").trim(),
        download: { name: "meeting-notes.md", mime: "text/markdown" },
        outputs: tasks ? [{ label: "Task list (plain text)", value: tasks }] : undefined,
      };
    },
  },

  "resume-bullet-improver": {
    sample: SAMPLE_BULLETS,
    inputLabel: "Resume bullet points (one per line)",
    options: [
      sel("tense", "Tense", "past", [
        ["past", "Past (previous roles)"],
        ["keep", "Keep as written (current role)"],
      ]),
    ],
    run: (t, o) => {
      const items = t.split(/\r?\n/).map((l) => l.replace(/^\s*(?:[-*•▪◦·]|\d+[.)])\s*/, "").trim()).filter(Boolean);
      if (!items.length) return { info: "Paste your bullet points, one per line." };
      const rows = [];
      const improved = [];
      let total = 0;
      for (const b of items) {
        const issues = [];
        let score = 10;
        let draft = b.replace(/\.$/, "");
        const first = (draft.match(/^[\p{L}'-]+/u) || [""])[0].toLowerCase();
        let replaced = false;
        for (const [re, verb] of WEAK) {
          if (re.test(draft)) {
            issues.push(`Weak opening '${draft.match(re)[0].trim()}'; start with a strong verb such as '${verb}'`);
            const rest = draft.replace(re, "");
            const ger = rest.match(/^([\p{L}]+ing)\b\s*/u);
            draft = ger ? rest.replace(ger[0], gerundToPast(ger[1]) + " ") : `${verb} ${rest}`;
            score -= 3;
            replaced = true;
            break;
          }
        }
        if (!replaced) {
          if (first === "i" || first === "we" || first === "my" || first === "our") {
            issues.push("Starts with a pronoun; resumes leave out 'I' and 'we'");
            draft = draft.replace(/^(?:i|we|my|our)\s+/i, "");
            score -= 1;
          }
          const w = (draft.match(/^[\p{L}'-]+/u) || [""])[0].toLowerCase();
          if (o.tense === "past" && PRESENT_TO_PAST[w]) {
            issues.push(`Present tense '${w}'; use '${PRESENT_TO_PAST[w]}' for past roles`);
            draft = draft.replace(/^[\p{L}'-]+/u, PRESENT_TO_PAST[w]);
            score -= 1;
          } else if (!STRONG.has(w) && !PRESENT_TO_PAST[w] && !/ed$/.test(w)) {
            issues.push("Does not start with an action verb");
            score -= 2;
          }
        }
        if (/\b(?:was|were|been|being|is|are)\s+[\p{L}]+(?:ed|en)\b/iu.test(draft)) {
          issues.push("Passive voice; say what you did");
          score -= 1;
        }
        const pron = draft.match(/\b(?:I|me|my|we|our)\b/g);
        if (pron) {
          issues.push(`Pronoun${pron.length > 1 ? "s" : ""} (${[...new Set(pron)].join(", ")})`);
          draft = draft.replace(/\s*\b(?:I|me|my)\b\s*/g, " ");
          score -= 1;
        }
        const fill = FILLER.filter((f) => new RegExp(`\\b${f}\\b`, "i").test(draft));
        if (fill.length) {
          issues.push(`Filler: ${fill.join(", ")}`);
          for (const f of fill) draft = draft.replace(new RegExp(`\\s*\\b${f}\\b`, "gi"), "");
          score -= Math.min(2, fill.length);
        }
        const hasNum = /\d|%|₹|\$|\b(?:lakh|crore|million|thousand|hundred|double[d]?|half|twice|three|four|five|six|seven|eight|nine|ten)\b/i.test(b);
        if (!hasNum) {
          issues.push("No number; add scale or a result (%, ₹, time saved, users)");
          score -= 2;
        }
        const wc = wordList(b).length;
        if (wc < 8) {
          issues.push("Very short; add how you did it and the result");
          score -= 1;
        } else if (wc > 32) {
          issues.push(`Long (${wc} words); aim for one to two lines`);
          score -= 1;
        }
        draft = draft.replace(/\s{2,}/g, " ").replace(/\s+([,.;])/g, "$1").trim();
        draft = draft.charAt(0).toUpperCase() + draft.slice(1);
        if (!hasNum) draft += ", [resulting in + measurable result]";
        score = Math.max(1, score);
        total += score;
        rows.push([b.length > 70 ? b.slice(0, 68) + "…" : b, `${score}/10`, issues.length ? issues.join("; ") : "Strong bullet"]);
        improved.push(issues.length ? draft + "." : b);
      }
      const avg = total / items.length;
      return {
        stats: [
          { label: "Bullets", value: String(items.length) },
          { label: "Average score", value: `${avg.toFixed(1)}/10`, warn: avg < 7 },
          { label: "Need a number", value: String(rows.filter((r) => /No number/.test(r[2])).length), warn: rows.some((r) => /No number/.test(r[2])) },
          { label: "Weak openings", value: String(rows.filter((r) => /Weak opening|action verb/.test(r[2])).length), warn: rows.some((r) => /Weak opening|action verb/.test(r[2])) },
        ],
        table: { cols: ["Bullet", "Score", "What to fix"], rows },
        output: improved.join("\n"),
        outputs: VERB_BANK.map(([l, v]) => ({ label: `Action verbs: ${l}`, value: v })),
        info: "Improved drafts are below. Replace anything in [brackets] with a real figure; never invent numbers.",
      };
    },
  },

  // ================= creator =================
  "youtube-title-description-helper": {
    sample: SAMPLE_YT,
    sample2: undefined,
    inputLabel: "Description",
    options: [
      txt("title", "Title", "Home Loan EMI Explained: ₹30 Lakh Loan, Total Interest & Prepayment", "Your video title", { counter: [20, 100] }),
      txt("kw", "Main keyword (optional)", "home loan EMI", "e.g. home loan EMI"),
    ],
    run: (t, o) => {
      const title = (o.title || "").trim();
      const kw = (o.kw || "").trim().toLowerCase();
      const desc = t;
      const checks = [];
      const tl = chars(title);
      if (!title) checks.push(bad("Add a title"));
      else if (tl > 100) checks.push(bad(`Title is ${tl} characters; YouTube allows 100`));
      else if (tl > 70) checks.push(warn(`Title is ${tl} characters`, "Search results and suggestions show roughly the first 60 to 70; put the hook and keyword first."));
      else if (tl < 20) checks.push(warn(`Title is only ${tl} characters`, "Short titles miss search terms; aim for 40 to 70."));
      else checks.push(ok(`Title length ${tl} characters`));
      if (title && /[<>]/.test(title)) checks.push(bad("Title contains < or >", "YouTube does not allow angle brackets in titles."));
      const capsWords = (title.match(/\b[A-Z]{3,}\b/g) || []).length;
      if (capsWords > 2) checks.push(warn(`${capsWords} words in ALL CAPS`, "One emphasised word stands out; several look like spam."));
      if (/[!?]{3,}/.test(title)) checks.push(warn("Repeated punctuation (!!! or ???)"));
      if (kw) {
        const pos = title.toLowerCase().indexOf(kw);
        if (pos < 0) checks.push(warn(`Keyword '${o.kw}' is not in the title`));
        else checks.push(pos <= 30 ? ok("Keyword appears early in the title") : warn("Keyword is late in the title", "Move it into the first 30 characters so it survives truncation."));
        const head = [...desc].slice(0, 200).join("").toLowerCase();
        checks.push(head.includes(kw) ? ok("Keyword is in the first two lines of the description") : warn("Keyword is not in the first two lines of the description", "The opening lines show before 'more' and in search snippets."));
      }
      const dl = chars(desc);
      if (dl > 5000) checks.push(bad(`Description is ${fmtN(dl)} characters; the limit is 5,000`));
      else if (dl < 200) checks.push(warn(`Description is only ${dl} characters`, "Two or three sentences plus links and chapters help viewers and search."));
      else checks.push(ok(`Description length ${fmtN(dl)} characters`));
      if (/[<>]/.test(desc)) checks.push(bad("Description contains < or >", "YouTube rejects angle brackets; replace them with words or ‹ ›."));
      const tagRe = /#[\p{L}\p{N}_]+/gu;
      const descTags = desc.match(tagRe) || [];
      const titleTags = title.match(tagRe) || [];
      const allTags = [...titleTags, ...descTags];
      if (allTags.length > 15) checks.push(bad(`${allTags.length} hashtags`, "With more than 15, YouTube ignores every hashtag on the video."));
      else if (allTags.length) checks.push(ok(`${allTags.length} hashtag${allTags.length === 1 ? "" : "s"}`, titleTags.length ? "Hashtags in the title replace the ones shown above it." : `${descTags.slice(0, 3).join(" ")} will show above the title.`));
      else checks.push(info("No hashtags", "Add 2 or 3 relevant ones; the first three appear above the title."));
      // chapters
      const chap = [];
      desc.split(/\r?\n/).forEach((line) => {
        const m = line.match(/^\s*[\[(]?((?:\d{1,2}:)?\d{1,2}:\d{2})[\])]?\s*[-–—:|]?\s*(.*)$/);
        if (m) chap.push({ ts: m[1], sec: tsToSec(m[1]), label: m[2].trim() });
      });
      const chapRows = [];
      if (chap.length) {
        let valid = true;
        const why = [];
        if (chap[0].sec !== 0) {
          valid = false;
          why.push("The first timestamp must be 0:00");
        }
        if (chap.length < 3) {
          valid = false;
          why.push("You need at least three timestamps");
        }
        chap.forEach((c, i) => {
          let note = "";
          if (i > 0 && c.sec <= chap[i - 1].sec) {
            valid = false;
            note = "Not in ascending order";
          } else if (i > 0 && c.sec - chap[i - 1].sec < 10) {
            valid = false;
            note = "Less than 10 seconds after the previous chapter";
          }
          if (!c.label) note = note || "Add a chapter name";
          chapRows.push([c.ts, c.label || "—", note || "✓"]);
        });
        if (chapRows.some((r) => r[2] !== "✓" && r[2] !== "Add a chapter name")) why.push("Fix the rows marked in the chapter table");
        checks.push(valid ? ok(`${chap.length} chapters will show on the progress bar`) : bad("Chapters will not show", why.join(". ") + "."));
      } else checks.push(info("No chapters", "List timestamps from 0:00 to help viewers jump to sections and to appear as key moments in Google."));
      const links = (desc.match(/https?:\/\/\S+/g) || []).length;
      if (links > 5) checks.push(info(`${links} links`, "Lots of links can look spammy; keep the important ones near the top."));
      const preview = [...desc.replace(/\s*\n\s*/g, " ")].slice(0, 157).join("");
      return {
        stats: [
          { label: "Title", value: `${tl}/100` , warn: tl > 70 },
          { label: "Description", value: `${fmtN(dl)}/5,000`, warn: dl > 5000 },
          { label: "Hashtags", value: String(allTags.length), warn: allTags.length > 15 },
          { label: "Chapters", value: String(chap.length) },
        ],
        checks,
        outputs: [
          { label: "Shown before 'more' (about 157 characters)", value: preview + (chars(desc) > 157 ? "…" : "") },
          { label: "Hashtags shown above the title", value: (titleTags.length ? [] : descTags.slice(0, 3)).join(" ") || "None" },
        ],
        table: chapRows.length ? { cols: ["Time", "Chapter", "Check"], rows: chapRows } : undefined,
      };
    },
  },

  "hashtag-organizer": {
    sample: SAMPLE_TAGS,
    inputLabel: "Caption, hashtags or keywords",
    options: [
      sel("platform", "Platform", "instagram", Object.entries(PLATFORMS).map(([k, v]) => [k, v.name])),
      sel("case", "Letter case", "keep", [
        ["keep", "Keep as written"],
        ["lower", "all lowercase"],
        ["camel", "CamelCase (easier to read)"],
      ]),
      sel("sort", "Order", "original", [
        ["original", "As found"],
        ["az", "A to Z"],
        ["short", "Shortest first"],
      ]),
      sel("sep", "Separate with", "space", [
        ["space", "Spaces"],
        ["line", "New lines"],
      ]),
      tog("words", "Turn plain words and phrases into hashtags", false),
      numo("group", "Split into sets of", 0, 0, 30),
    ],
    run: (t, o) => {
      if (!t.trim()) return { info: "Paste a caption, a list of hashtags, or keywords." };
      const found = t.match(/#[\p{L}\p{N}_]+/gu) || [];
      let tags = found.map((x) => x.slice(1));
      if (o.words || !found.length) {
        const phrases = t
          .replace(/#[\p{L}\p{N}_]+/gu, " ")
          .split(/[\n,;|]+/)
          .map((p) => p.trim())
          .filter((p) => p && p.split(/\s+/).length <= 4);
        tags = tags.concat(phrases.map(camel).filter(Boolean));
      }
      const seen = new Map();
      const dupes = [];
      for (let tag of tags) {
        tag = tag.replace(/_+$/, "");
        if (!tag) continue;
        const key = tag.toLowerCase();
        if (seen.has(key)) dupes.push(tag);
        else seen.set(key, tag);
      }
      let list = [...seen.values()];
      if (o.case === "lower") list = list.map((x) => x.toLowerCase());
      else if (o.case === "camel") list = list.map((x) => (/[a-z]/.test(x) && /[A-Z]/.test(x) ? x : x.charAt(0).toUpperCase() + x.slice(1)));
      if (o.sort === "az") list.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
      else if (o.sort === "short") list.sort((a, b) => a.length - b.length);
      const plat = PLATFORMS[o.platform] || PLATFORMS.instagram;
      const rows = list.map((x) => {
        const notes = [];
        if (/^\d+$/.test(x)) notes.push("Numbers only: not clickable");
        if (x.length > 30) notes.push("Very long; hard to read");
        if (/^[a-z]+$/.test(x) && x.length > 14) notes.push("Consider CamelCase");
        return [`#${x}`, x.length + 1, notes.join("; ") || "✓"];
      });
      const usable = list.filter((x) => !/^\d+$/.test(x));
      const joiner = o.sep === "line" ? "\n" : " ";
      const size = Math.max(0, o.group | 0);
      const sets = size ? Array.from({ length: Math.ceil(usable.length / size) }, (_, i) => usable.slice(i * size, i * size + size)) : [usable];
      const output = sets.map((s) => s.map((x) => `#${x}`).join(joiner)).join("\n\n");
      const checks = [];
      if (usable.length > plat.max) checks.push((o.platform === "instagram" || o.platform === "youtube" ? bad : warn)(`${usable.length} hashtags for ${plat.name}`, `${plat.note}${size ? "" : ` Set 'Split into sets of' to ${plat.max} to make posts that fit.`}`));
      else checks.push(ok(`${usable.length} hashtag${usable.length === 1 ? "" : "s"} fits ${plat.name}`, plat.note));
      if (dupes.length) checks.push(info(`${dupes.length} duplicate${dupes.length === 1 ? "" : "s"} removed`, [...new Set(dupes)].map((d) => `#${d}`).join(" ")));
      if (list.length !== usable.length) checks.push(warn("Number-only hashtags removed", "Tags like #2026 do not work as hashtags on most platforms."));
      return {
        output,
        stats: [
          { label: "Found", value: String(tags.length) },
          { label: "Unique", value: String(usable.length) },
          { label: "Duplicates", value: String(dupes.length) },
          { label: `${plat.name} limit`, value: String(plat.max), warn: usable.length > plat.max },
        ],
        checks,
        table: { cols: ["Hashtag", "Length", "Note"], rows },
      };
    },
  },
};
