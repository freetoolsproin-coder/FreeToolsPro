/**
 * Regenerates:
 * - public/sitemap.xml          (sitemap index)
 * - public/sitemap-apex.xml     (tools + static pages)
 * - public/sitemap-blog.xml     (blog.freetoolspro.in)
 * and mirrors the same files at repo root.
 *
 * Blog lastmod comes from frontmatter updated|date; apex uses TODAY.
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const ROOT = process.cwd();
const APEX = "https://freetoolspro.in";
const BLOG = "https://blog.freetoolspro.in";
const TODAY = new Date().toISOString().slice(0, 10);
const BLOG_DIR = path.join(ROOT, "blog/content");

function extractQuoted(field, text) {
  const re = new RegExp(`${field}:\\s*["']([^"']+)["']`, "g");
  return [...text.matchAll(re)].map((m) => m[1]);
}

function isConcretePath(p) {
  if (!p || typeof p !== "string") return false;
  if (!p.startsWith("/")) return false;
  if (p.includes("*") || p.includes(":")) return false;
  if (p.includes("?")) return false;
  return true;
}

/** Paths that are redirects / aliases — skip from sitemap */
const SKIP = new Set([
  "/Contact",
  "/privacy",
  "/cookies",
  "/terms-and-conditions",
  "/tools/",
  "/blog",
  "/text-tools/unwrap-text",
  "/text-tools/outdent-text",
  "/text-tools/sort-lines-za",
  "/text-tools/remove-line-numbers",
  "/developer-tools/sql-beautifier",
  "/developer-tools/ip-address",
  "/developer-tools/ip-address-checker",
  "/social-media-tools/ai-prompt-improver",
  "/calculators/emi-calculator-amm",
]);

function urlEntry(loc, { lastmod = TODAY, changefreq = "weekly", priority = "0.8" } = {}) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function parseBlogFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  if (!raw.startsWith("---")) {
    return { lastmod: TODAY, featured: false, title: null, date: TODAY };
  }
  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    return { lastmod: TODAY, featured: false, title: null, date: TODAY };
  }
  const fm = raw.slice(3, end);
  const updated = fm.match(/updated:\s*["']?(\d{4}-\d{2}-\d{2})/);
  const date = fm.match(/date:\s*["']?(\d{4}-\d{2}-\d{2})/);
  const published = fm.match(/published:\s*["']?(\d{4}-\d{2}-\d{2})/);
  const title = fm.match(/title:\s*["']([^"']+)["']/);
  const featured = /featured:\s*(true|"true"|'true')/.test(fm);
  const day = updated?.[1] || date?.[1] || published?.[1] || TODAY;
  return { lastmod: day, featured, title: title?.[1] || null, date: date?.[1] || day };
}

function sleepSync(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* spin — short retries only */
  }
}

/** Atomic-ish write with retries (Windows AV / indexer can lock sitemap.xml). */
function writeFileReliable(filePath, data) {
  const tmp = `${filePath}.${process.pid}.tmp`;
  let lastErr;
  for (let i = 0; i < 8; i += 1) {
    try {
      fs.writeFileSync(tmp, data);
      fs.renameSync(tmp, filePath);
      return;
    } catch (err) {
      lastErr = err;
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* ignore */
      }
      try {
        fs.writeFileSync(filePath, data);
        return;
      } catch (err2) {
        lastErr = err2;
      }
      sleepSync(80 * (i + 1));
    }
  }
  throw lastErr;
}

function writeUrlset(filePath, entries) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
  writeFileReliable(filePath, xml);
}

function writeBoth(relName, contents) {
  const publicPath = path.join(ROOT, "public", relName);
  const rootPath = path.join(ROOT, relName);
  if (typeof contents === "string") {
    writeFileReliable(publicPath, contents);
    writeFileReliable(rootPath, contents);
  } else {
    writeUrlset(publicPath, contents);
    writeUrlset(rootPath, contents);
  }
  return publicPath;
}

const toolDef = fs.readFileSync(path.join(ROOT, "src/data/toolDefinitions.js"), "utf8");
const toolBlocks = toolDef.split(/^\s*\{/m);
const tools = [];
for (const block of toolBlocks) {
  const pathMatch = block.match(/path:\s*["']([^"']+)["']/);
  const idMatch = block.match(/id:\s*["']([^"']+)["']/);
  const pageLink = /isPageLink:\s*true/.test(block);
  if (!pathMatch) continue;
  tools.push({ id: idMatch?.[1], path: pathMatch[1], isPageLink: pageLink });
}

const routes = fs.readFileSync(path.join(ROOT, "src/routes/appRoutes.jsx"), "utf8");
const routePaths = extractQuoted("path", routes).filter(isConcretePath);

const seo = fs.readFileSync(path.join(ROOT, "src/seo/seoConfig.js"), "utf8");
const seoPaths = extractQuoted("path", seo).filter(isConcretePath);

const cats = extractQuoted("slug", fs.readFileSync(path.join(ROOT, "blog/data/categories.js"), "utf8"));

const blogFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).sort();
const blogPosts = blogFiles.map((file) => {
  const slug = file.replace(/\.md$/, "");
  const meta = parseBlogFrontmatter(path.join(BLOG_DIR, file));
  return { slug, ...meta, isGuide: slug.endsWith("-guide") };
});

const apexPaths = new Set([
  "/",
  "/tools",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/cookie-policy",
  "/llms.txt",
  "/llms-full.txt",
]);

for (const t of tools) {
  if (!isConcretePath(t.path)) continue;
  if (SKIP.has(t.path)) continue;
  if (t.path === "/blog" || t.path.startsWith("/blog/")) continue;
  apexPaths.add(t.path);
}

for (const p of routePaths) {
  if (SKIP.has(p)) continue;
  if (p === "/blog" || p.startsWith("/blog/")) continue;
  apexPaths.add(p);
}

for (const p of seoPaths) {
  if (SKIP.has(p)) continue;
  if (p.startsWith("/blog")) continue;
  apexPaths.add(p);
}

// Programmatic SEO variants (concrete URLs expanded from generators)
let variantPaths = [];
try {
  const mod = await import(
    pathToFileURL(path.join(ROOT, "src/data/seoVariants/index.js")).href
  );
  variantPaths = mod.listSeoVariantPaths?.() || [];
  for (const p of variantPaths) {
    if (!isConcretePath(p) || SKIP.has(p)) continue;
    apexPaths.add(p);
  }
} catch (err) {
  console.warn("seoVariants sitemap expand failed:", err?.message || err);
}

const sortedApex = [...apexPaths].sort((a, b) => {
  if (a === "/") return -1;
  if (b === "/") return 1;
  return a.localeCompare(b);
});

const apexEntries = [];
for (const p of sortedApex) {
  const loc = p === "/" ? `${APEX}/` : `${APEX}${p}`;
  let priority = "0.8";
  let changefreq = "weekly";
  if (p === "/") {
    priority = "1.0";
  } else if (["/tools", "/about", "/contact"].includes(p)) {
    priority = "0.8";
  } else if (["/privacy-policy", "/terms", "/disclaimer", "/cookie-policy"].includes(p)) {
    priority = "0.5";
    changefreq = "monthly";
  } else if (p.startsWith("/llms")) {
    priority = "0.6";
    changefreq = "weekly";
  } else if (
    /\/(image-format-converter|image-compressor|image-to-base64|base64-decode|base64-encode|unit-converter)\//.test(
      p
    ) ||
    /\/(simple-interest-calculator|compound-interest-calculator|emi-calculator|bmi-calculator|sip-calculator|inflation-calculator|loan-eligibility-calculator|gst-calculator)\//.test(
      p
    )
  ) {
    priority = "0.65";
    changefreq = "monthly";
  }
  apexEntries.push(urlEntry(loc, { lastmod: TODAY, priority, changefreq }));
}

const blogEntries = [];
blogEntries.push(urlEntry(`${BLOG}/`, { lastmod: TODAY, priority: "0.9", changefreq: "daily" }));

let newestBlog = TODAY;
for (const c of cats) {
  blogEntries.push(
    urlEntry(`${BLOG}/category/${c}`, { lastmod: TODAY, priority: "0.7", changefreq: "weekly" })
  );
}

for (const post of blogPosts) {
  if (post.lastmod > newestBlog) newestBlog = post.lastmod;
  blogEntries.push(
    urlEntry(`${BLOG}/${post.slug}`, {
      lastmod: post.lastmod,
      priority: post.isGuide ? "0.55" : post.featured ? "0.8" : "0.7",
      changefreq: "monthly",
    })
  );
}

writeBoth("sitemap-apex.xml", apexEntries);
writeBoth("sitemap-blog.xml", blogEntries);

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${APEX}/sitemap-apex.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${APEX}/sitemap-blog.xml</loc>
    <lastmod>${newestBlog}</lastmod>
  </sitemap>
</sitemapindex>
`;

writeBoth("sitemap.xml", indexXml);

console.log(
  JSON.stringify(
    {
      index: "sitemap.xml",
      children: ["sitemap-apex.xml", "sitemap-blog.xml"],
      apexUrls: apexEntries.length,
      blogUrls: blogEntries.length,
      blogPosts: blogPosts.length,
      seoVariants: variantPaths.length,
      blogNewestLastmod: newestBlog,
      totalUrls: apexEntries.length + blogEntries.length,
    },
    null,
    2
  )
);
