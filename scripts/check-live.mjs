// Checks the LIVE site for duplicate URLs that make Google pick its own canonical.
// Usage: npm run check:live            (or: node scripts/check-live.mjs https://freetoolspro.in)
// Every alternate spelling of a page must 301 straight to the one canonical URL, and every
// sitemap URL must answer 200 with a canonical tag pointing at itself.
const BASE = (process.argv[2] || "https://freetoolspro.in").replace(/\/$/, "");
const host = new URL(BASE).host;

let failed = 0;
const ok = (msg) => console.log("  ok   " + msg);
const bad = (msg) => (failed++, console.log("  FAIL " + msg));

async function head(url) {
  const r = await fetch(url, { redirect: "manual" });
  return { status: r.status, location: r.headers.get("location"), body: r.status === 200 ? await r.text() : "" };
}
const abs = (loc, from) => (loc ? new URL(loc, from).href : null);
const canonicalOf = (html) => (html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/) || [])[1] || null;

async function expectRedirect(from, to) {
  try {
    const r = await head(from);
    const got = abs(r.location, from);
    if (r.status === 301 && got === to) ok(`${from} -> 301 ${to}`);
    else bad(`${from} -> ${r.status} ${got || ""}  (want 301 ${to})`);
  } catch (e) {
    bad(`${from} -> ${e.cause?.code || e.message}`);
  }
}

async function expectStatus(url, want) {
  const r = await head(url);
  if (r.status === want) ok(`${url} -> ${r.status}`);
  else bad(`${url} -> ${r.status} ${abs(r.location, url) || ""}  (want ${want})`);
}

const page = `${BASE}/calculators/emi-calculator`;
console.log("\nHost and protocol");
await expectRedirect(`https://www.${host}/calculators/emi-calculator`, page);
await expectRedirect(`http://${host}/calculators/emi-calculator`, page);
await expectRedirect(`http://www.${host}/calculators/emi-calculator`, page);

console.log("\nURL spelling");
await expectRedirect(`${page}.html`, page);
await expectRedirect(`${page}/`, page);
await expectRedirect(`${BASE}/index.html`, `${BASE}/`);
await expectRedirect(`${BASE}/ebooks/`, `${BASE}/ebooks`);
await expectRedirect(`${BASE}/pdf-tools/merge-pdf`, `${BASE}/pdf-tools/pdf-merger`);
await expectRedirect(`${page}/old-variant`, page);

console.log("\nStatus codes");
await expectStatus(`${BASE}/this-page-does-not-exist`, 404);
await expectStatus(`${BASE}/blog`, 410);

console.log("\nSitemap URLs (200 + self-canonical)");
const index = await (await fetch(`${BASE}/sitemap.xml`)).text();
const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urls = [];
for (const m of maps) urls.push(...[...(await (await fetch(m)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]));
let good = 0;
for (let i = 0; i < urls.length; i += 10) {
  await Promise.all(
    urls.slice(i, i + 10).map(async (u) => {
      const r = await head(u);
      const c = r.status === 200 ? canonicalOf(r.body) : null;
      if (r.status === 200 && c === u) good++;
      else bad(`${u} -> ${r.status} ${abs(r.location, u) || ""} canonical=${c}`);
    })
  );
}
ok(`${good} of ${urls.length} sitemap URLs answer 200 with a self-referencing canonical`);

console.log(failed ? `\n${failed} problem(s) found.\n` : "\nAll good: every page has exactly one URL.\n");
process.exit(failed ? 1 : 0);
