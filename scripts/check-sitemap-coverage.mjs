import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function locsFromSitemap(file) {
  if (!fs.existsSync(file)) return new Set();
  const text = fs.readFileSync(file, "utf8");
  return new Set([...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));
}

function pathFromUrl(u) {
  try {
    let p = new URL(u).pathname || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  } catch {
    return u;
  }
}

function extractQuoted(field, text) {
  const re = new RegExp(`${field}:\\s*["']([^"']+)["']`, "g");
  return [...text.matchAll(re)].map((m) => m[1]);
}

const smPublic = locsFromSitemap(path.join(ROOT, "public/sitemap.xml"));
const smRoot = locsFromSitemap(path.join(ROOT, "sitemap.xml"));

const toolDef = fs.readFileSync(path.join(ROOT, "src/data/toolDefinitions.js"), "utf8");
const toolPaths = new Set(extractQuoted("path", toolDef));

const routes = fs.readFileSync(path.join(ROOT, "src/routes/appRoutes.jsx"), "utf8");
const routePaths = new Set(extractQuoted("path", routes));

const seo = fs.readFileSync(path.join(ROOT, "src/seo/seoConfig.js"), "utf8");
const seoPaths = new Set(extractQuoted("path", seo));

const blogDir = path.join(ROOT, "blog/content");
const blogSlugs = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
  : [];

const catText = fs.readFileSync(path.join(ROOT, "blog/data/categories.js"), "utf8");
const cats = extractQuoted("slug", catText);

const expected = new Set();
const add = (p) => {
  if (!p || p.includes("*") || p.includes(":")) return;
  expected.add(p.startsWith("/") ? p : `/${p}`);
};

[
  "/",
  "/tools",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/cookie-policy",
].forEach(add);

for (const p of toolPaths) {
  if (p === "/blog" || p.startsWith("/blog")) continue;
  add(p);
}
for (const p of routePaths) add(p);
for (const p of seoPaths) add(p);

// Blog host paths (no /articles prefix)
const blogExpected = new Set(["/"]);
for (const c of cats) blogExpected.add(`/category/${c}`);
for (const s of blogSlugs) blogExpected.add(`/${s}`);

const apexSmPaths = new Set(
  [...smPublic]
    .filter((u) => u.includes("freetoolspro.in") && !u.includes("blog."))
    .map(pathFromUrl)
);
const blogSmPaths = new Set(
  [...smPublic].filter((u) => u.includes("blog.freetoolspro.in")).map(pathFromUrl)
);

const missingApex = [...expected]
  .filter((p) => !apexSmPaths.has(p))
  .sort();

const missingBlog = [...blogExpected].filter((p) => !blogSmPaths.has(p)).sort();

// Tools that are page links / categories may be expected extras
const toolOnlyMissing = missingApex.filter((p) => toolPaths.has(p));
const staticMissing = missingApex.filter((p) => !toolPaths.has(p) && !routePaths.has(p));
const routeOnlyMissing = missingApex.filter((p) => routePaths.has(p) && !toolPaths.has(p));

const extraApex = [...apexSmPaths]
  .filter((p) => !expected.has(p) && p !== "/blog" && !p.startsWith("/blog/"))
  .sort();

const extraBlog = [...blogSmPaths].filter((p) => !blogExpected.has(p)).sort();

const report = {
  counts: {
    publicSitemapLocs: smPublic.size,
    rootSitemapLocs: smRoot.size,
    publicEqualsRoot:
      smPublic.size === smRoot.size && [...smPublic].every((u) => smRoot.has(u)),
    toolPaths: toolPaths.size,
    routePaths: routePaths.size,
    blogSlugs: blogSlugs.length,
    blogCategories: cats.length,
    expectedApex: expected.size,
    apexInSitemap: apexSmPaths.size,
    blogInSitemap: blogSmPaths.size,
    missingApex: missingApex.length,
    missingTools: toolOnlyMissing.length,
    missingRoutesOnly: routeOnlyMissing.length,
    missingBlog: missingBlog.length,
    extraApex: extraApex.length,
    extraBlog: extraBlog.length,
  },
  missingTools: toolOnlyMissing,
  missingRoutesOnly: routeOnlyMissing.slice(0, 60),
  missingStaticOrSeo: staticMissing.slice(0, 40),
  missingBlog,
  extraApexSample: extraApex.slice(0, 40),
  extraBlogSample: extraBlog.slice(0, 40),
  blogHostPathStyle: {
    usesArticlesPrefix: [...blogSmPaths].some((p) => p.startsWith("/articles")),
    usesRootSlugs: [...blogSmPaths].some(
      (p) => p !== "/" && !p.startsWith("/category")
    ),
    sample: [...blogSmPaths].slice(0, 12),
  },
};

const missingBlogLegacy = blogSlugs.filter((s) => !blogSmPaths.has(`/${s}`)).sort();
const missingBlogCats = cats.filter((c) => !blogSmPaths.has(`/category/${c}`)).sort();

report.counts.missingBlogPosts = missingBlogLegacy.length;
report.counts.missingBlogCategories = missingBlogCats.length;
report.missingBlogPosts = missingBlogLegacy;
report.missingBlogCategories = missingBlogCats;

console.log(JSON.stringify(report, null, 2));

if (toolOnlyMissing.length || missingBlogLegacy.length) {
  process.exitCode = 2;
}
