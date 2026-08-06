import { SEO_CONFIG } from "./seoConfig";
import { getSeoVariantByPath } from "../data/seoVariants";

/** path → seoConfig entry (first match wins). */
const PATH_INDEX = (() => {
  const map = new Map();
  for (const [key, entry] of Object.entries(SEO_CONFIG)) {
    if (!entry?.path || map.has(entry.path)) continue;
    map.set(entry.path, { key, ...entry });
  }
  return map;
})();

export function getSeoByPath(pathname) {
  if (!pathname) return null;
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const fromConfig = PATH_INDEX.get(normalized) || PATH_INDEX.get(pathname) || null;
  if (fromConfig) return fromConfig;

  const variant = getSeoVariantByPath(normalized);
  if (!variant) return null;
  return {
    key: `variant:${variant.path}`,
    title: variant.title,
    description: variant.description,
    keywords: variant.keywords.join(", "),
    path: variant.path,
    type: "tool",
    category: variant.category,
  };
}

export function listToolSeoEntries() {
  return Object.entries(SEO_CONFIG)
    .filter(([, entry]) => entry?.type === "tool")
    .map(([key, entry]) => ({ key, ...entry }));
}
