import { urlset } from "../lib/sitemap.js";
export const GET = () =>
  urlset(["/about", "/contact", "/ebooks", "/privacy-policy", "/terms", "/disclaimer", "/cookie-policy"], (p) => (p === "/ebooks" ? "0.6" : "0.3"));
