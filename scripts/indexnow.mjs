// Tell Bing, Yandex and other IndexNow engines about every page after a deploy.
// Bing's index also feeds ChatGPT search and Copilot, so this speeds up AI citations too.
// Usage (after the site is live): npm run indexnow             submits every page
//                                 npm run indexnow -- /a /b   submits only these paths (after an SEO refresh)
// The key file public/787cb1b8b400efd9dd8a4225c8fa86a5.txt must be reachable at https://freetoolspro.in/787cb1b8b400efd9dd8a4225c8fa86a5.txt
import { TOOLS, CATEGORIES } from "../src/data/catalog.js";
import { SITE } from "../src/data/site.js";

const KEY = "787cb1b8b400efd9dd8a4225c8fa86a5";
const host = new URL(SITE.url).host;
const only = process.argv.slice(2).filter((a) => a.startsWith("/"));
const paths = only.length ? only : ["/", "/tools", "/about", ...CATEGORIES.map((c) => c.path), ...TOOLS.map((t) => t.path)];
const urlList = paths.map((p) => SITE.url + (p === "/" ? "/" : p));

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE.url}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) {
  console.log(await res.text());
  process.exit(1);
}
