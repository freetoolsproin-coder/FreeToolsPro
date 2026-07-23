import fs from "fs";
import path from "path";
import { SEO_CONFIG } from "../src/seo/seoConfig.js";

const SITE_URL = "https://freetoolspro.in";

/** One path → one sitemap URL (seoConfig must not list the same path under multiple titles). */
const seenPaths = new Set();
const uniqueEntries = Object.values(SEO_CONFIG).filter((p) => {
  if (!p?.path || seenPaths.has(p.path)) return false;
  seenPaths.add(p.path);
  return true;
});

const urls = uniqueEntries
  .map(
    (p) => `
  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p.path === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap.trim());

console.log("✅ sitemap.xml generated");
