import yaml from "js-yaml";
import { BLOG_CATEGORIES, getCategory } from "./categories";
import { blogPostPath } from "./blogSite";

const rawModules = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function parseFrontmatter(raw) {
  const text = String(raw || "").replace(/^\uFEFF/, "");
  if (!text.startsWith("---")) {
    return { data: {}, content: text };
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: text };
  }
  const fm = text.slice(3, end).trim();
  const content = text.slice(end + 4).replace(/^\r?\n/, "");
  let data = {};
  try {
    data = yaml.load(fm, { schema: yaml.FAILSAFE_SCHEMA }) || {};
  } catch {
    data = {};
  }
  return { data, content };
}

function normalizeRelatedTools(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/** js-yaml parses bare dates as Date — keep ISO strings for React/schema safety. */
function toDateString(value, fallback = "2026-07-22") {
  if (!value) return fallback;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") return value.slice(0, 10);
  return fallback;
}

function parsePost(raw, filePath) {
  const { data, content } = parseFrontmatter(raw);
  const slug = data.slug || filePath.split("/").pop().replace(/\.md$/, "");
  const category = data.category || "guides";
  const catMeta = getCategory(category);
  const date = toDateString(data.date || data.published);
  const updated = toDateString(data.updated || data.date || data.published, date);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    category,
    categoryLabel: catMeta?.label || category,
    date,
    updated,
    tags: Array.isArray(data.tags) ? data.tags : [],
    relatedTools: normalizeRelatedTools(data.relatedTools),
    cover: data.cover || null,
    featured: data.featured === true || data.featured === "true",
    content: String(content || "").trim(),
    path: `/${slug}`,
  };
}

function withLivePath(post) {
  return post ? { ...post, path: blogPostPath(post.slug) } : null;
}

const ALL_POSTS = Object.entries(rawModules)
  .map(([filePath, raw]) => parsePost(raw, filePath))
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export function getAllPosts() {
  return ALL_POSTS.map(withLivePath);
}

export function getPostBySlug(slug) {
  return withLivePath(ALL_POSTS.find((p) => p.slug === slug) || null);
}

export function getPostsByCategory(category) {
  return ALL_POSTS.filter((p) => p.category === category).map(withLivePath);
}

export function getFeaturedPosts(limit = 3) {
  const featured = ALL_POSTS.filter((p) => p.featured);
  const list = featured.length ? featured : ALL_POSTS;
  return list.slice(0, limit).map(withLivePath);
}

export function getAdjacentPosts(slug) {
  const idx = ALL_POSTS.findIndex((p) => p.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: withLivePath(ALL_POSTS[idx + 1] || null),
    next: withLivePath(ALL_POSTS[idx - 1] || null),
  };
}

export function getBlogCategoryStats() {
  return BLOG_CATEGORIES.map((cat) => ({
    ...cat,
    count: getPostsByCategory(cat.slug).length,
  }));
}

export { BLOG_CATEGORIES, getCategory, isValidCategory } from "./categories";
