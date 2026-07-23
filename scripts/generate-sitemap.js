import fs from "fs";
import path from "path";
import fg from "fast-glob";
import { SitemapStream, streamToPromise } from "sitemap";

const BASE_URL = "https://freetoolspro.in";

// Pages to ignore
const ignorePages = [
  "404",
  "NotFound",
  "Admin",
  "Login",
  "Dashboard"
];

// Scan React pages automatically
const files = fg.sync("src/pages/**/*.{jsx,tsx,js,ts}");

const urls = files
  .map(file => {
    let route = file
      .replace("src/pages", "")
      .replace(/\.(jsx|tsx|js|ts)/, "")
      .replace(/\/index$/, "")
      .replace(/\\/g, "/");

    if (route === "") route = "/";

    return route;
  })
  .filter(route => {
    return !ignorePages.some(page =>
      route.toLowerCase().includes(page.toLowerCase())
    );
  });

// Add extra static pages
const extraPages = [
  "/",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/suggestion"
];

const allUrls = [...new Set([...urls, ...extraPages])];

const sitemap = new SitemapStream({
  hostname: BASE_URL
});

(async () => {

  for (const url of allUrls) {

    sitemap.write({
      url,
      lastmod: new Date().toISOString().split("T")[0]
    });

  }

  sitemap.end();

  const xml = await streamToPromise(sitemap);

  fs.writeFileSync(
    path.resolve("public/sitemap.xml"),
    xml.toString()
  );

  console.log("✅ Sitemap Generated");

})();