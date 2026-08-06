/** Normalize a programmatic SEO landing-page record. */

export function buildVariant({
  slug,
  parentPath,
  parentName,
  category,
  h1,
  title,
  description,
  keywords = [],
  intent = "transactional",
  intro,
  steps = [],
  faqs = [],
  presets = {},
  relatedSlugs = [],
  ctaLabel,
}) {
  const path = `${parentPath.replace(/\/$/, "")}/${slug}`;
  return {
    slug,
    path,
    parentPath,
    parentName,
    category,
    h1,
    title,
    description,
    keywords: keywords.filter(Boolean),
    intent,
    intro,
    steps,
    faqs,
    presets,
    relatedSlugs,
    ctaLabel: ctaLabel || `Open ${parentName}`,
    toolUrl: buildToolUrl(parentPath, presets),
  };
}

export function buildToolUrl(parentPath, presets = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(presets)) {
    if (v == null || v === "") continue;
    params.set(k, String(v));
  }
  const q = params.toString();
  return q ? `${parentPath}?${q}` : parentPath;
}

export function labelize(id) {
  return String(id)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
