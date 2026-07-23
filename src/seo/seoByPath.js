import { SEO_CONFIG } from "./seoConfig";

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
  return PATH_INDEX.get(normalized) || PATH_INDEX.get(pathname) || null;
}

export function listToolSeoEntries() {
  return Object.entries(SEO_CONFIG)
    .filter(([, entry]) => entry?.type === "tool")
    .map(([key, entry]) => ({ key, ...entry }));
}
