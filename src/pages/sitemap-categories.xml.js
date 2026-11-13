import { urlset } from "../lib/sitemap.js";
import { CATEGORIES } from "../data/catalog.js";
export const GET = () => urlset(["/", "/tools", ...CATEGORIES.map((c) => c.path)], (p) => (p === "/" ? "1.0" : "0.7"));
