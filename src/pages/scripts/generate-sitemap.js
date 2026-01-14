import fs from "fs";
import path from "path";
import { SEO_CONFIG } from "../src/seo/seoConfig.js";

const SITE_URL = "https://freetoolspro.in/";

const urls = Object.values(SEO_CONFIG)
  .filter((p) => p.path)
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

fs.writeFileSync(
  path.resolve("public/sitemap.xml"),
  sitemap.trim()
);

console.log("✅ sitemap.xml generated");
