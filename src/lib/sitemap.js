import { SITE } from "../data/site.js";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function urlset(paths, priority = "0.8", lastmod = () => SITE.updated) {
  const body = paths
    .map((p) => `  <url>\n    <loc>${esc(SITE.url + p)}</loc>\n    <lastmod>${lastmod(p)}</lastmod>\n    <priority>${typeof priority === "function" ? priority(p) : priority}</priority>\n  </url>`)
    .join("\n");
  return xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
}

export function index(files) {
  const body = files.map((f) => `  <sitemap>\n    <loc>${SITE.url}/${f}</loc>\n    <lastmod>${SITE.updated}</lastmod>\n  </sitemap>`).join("\n");
  return xml(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`);
}

function xml(s) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${s}\n`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
