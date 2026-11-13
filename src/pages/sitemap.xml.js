import { index } from "../lib/sitemap.js";
// Keeps the same index URL and child file names as the old site, so Search Console keeps working.
export const GET = () => index(["sitemap-tools.xml", "sitemap-categories.xml", "sitemap-pages.xml"]);
