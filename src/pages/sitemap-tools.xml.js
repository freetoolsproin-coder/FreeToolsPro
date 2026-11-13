import { urlset } from "../lib/sitemap.js";
import { toolByPath, TOOLS } from "../data/catalog.js";
import { SITE } from "../data/site.js";
// <lastmod> is the page's own SEO update date when it is newer than the site-wide review date.
const lastmod = (p) => {
  const u = toolByPath[p].updated;
  return u && u > SITE.updated ? u : SITE.updated;
};
export const GET = () => urlset(TOOLS.map((t) => t.path), (p) => (toolByPath[p].popular ? "0.9" : "0.8"), lastmod);
