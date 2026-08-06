/** Public blog host — markdown articles live in repo /blog/content/*.md */
export const BLOG_ORIGIN = "https://blog.freetoolspro.in";

/** Main FreeToolsPro site (tools, legal pages, home). */
export const APEX_ORIGIN = "https://freetoolspro.in";

/**
 * Public path prefix on the blog host (empty = site root).
 * Posts: https://blog.freetoolspro.in/<slug>
 * Categories: https://blog.freetoolspro.in/category/<slug>
 */
export const BLOG_ARTICLES_PREFIX = "";

/** Temporary: hide Blog links in header / footer / home nav. Set true to restore. */
export const BLOG_NAV_VISIBLE = true;

export function isBlogHostname(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
  if (!hostname) return false;
  const host = hostname.toLowerCase();
  return host === "blog.freetoolspro.in" || host.startsWith("blog.");
}

export function isLocalDevHost(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
  if (!hostname) return true;
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    host.endsWith(".localhost")
  );
}

/**
 * Apex production only: send /blog → blog.freetoolspro.in.
 * Localhost keeps an in-app /blog experience for development.
 */
export function shouldRedirectBlogToSubdomain(
  hostname = typeof window !== "undefined" ? window.location.hostname : ""
) {
  if (isBlogHostname(hostname)) return false;
  if (isLocalDevHost(hostname)) return false;
  return true;
}

/** True on the main FreeToolsPro site (apex) — not the blog subdomain. */
export function isApexHostname(hostname = typeof window !== "undefined" ? window.location.hostname : "") {
  if (!hostname) return true;
  return !isBlogHostname(hostname);
}

/**
 * In-app path prefix for the article list + posts.
 * - blog subdomain: "" (site root)
 * - local apex: /blog
 */
export function blogBasePath() {
  if (typeof window !== "undefined" && isBlogHostname(window.location.hostname)) {
    return "";
  }
  return "/blog";
}

export function blogHomePath() {
  return blogBasePath() || "/";
}

export function blogPostPath(slug) {
  const base = blogBasePath();
  return base ? `${base}/${slug}` : `/${slug}`;
}

export function blogCategoryPath(category) {
  const base = blogBasePath();
  return base ? `${base}/category/${category}` : `/category/${category}`;
}

/**
 * Normalize any blog-ish path to the public blog form (no origin).
 * Examples:
 *   /blog/foo          → /foo
 *   /blog/articles/foo → /foo
 *   /articles/foo      → /foo
 *   /blog              → /
 *   /articles          → /
 *   /                  → /
 */
export function toPublicBlogPath(path = "/") {
  if (!path) return "/";
  if (path.startsWith("http")) {
    try {
      path = new URL(path).pathname;
    } catch {
      return "/";
    }
  }

  let clean = path.startsWith("/") ? path : `/${path}`;

  if (
    clean === "/" ||
    clean === "/blog" ||
    clean === "/blog/" ||
    clean === "/articles" ||
    clean === "/articles/"
  ) {
    return "/";
  }

  if (clean.startsWith("/blog/articles/")) {
    clean = clean.slice("/blog/articles".length) || "/";
  } else if (clean.startsWith("/blog/")) {
    clean = clean.slice("/blog".length) || "/";
  } else if (clean.startsWith("/articles/")) {
    clean = clean.slice("/articles".length) || "/";
  }

  if (!clean.startsWith("/")) clean = `/${clean}`;
  if (clean.endsWith("/") && clean !== "/") {
    clean = clean.replace(/\/+$/, "");
  }

  return clean || "/";
}

/**
 * Absolute public URL for a blog path (https://blog.freetoolspro.in/...).
 */
export function blogAbsoluteUrl(path = "/") {
  if (!path) return `${BLOG_ORIGIN}/`;
  if (path.startsWith("http") && path.startsWith(BLOG_ORIGIN)) return path;
  if (path.startsWith("http")) return path;
  const clean = toPublicBlogPath(path);
  return `${BLOG_ORIGIN}${clean === "/" ? "/" : clean}`;
}

/**
 * Nav / CTA target from the main site:
 * - local → /blog
 * - live apex → https://blog.freetoolspro.in/
 * - blog host → /
 */
export function blogNavHref(path = "/") {
  if (typeof window !== "undefined" && isBlogHostname()) {
    return toPublicBlogPath(path);
  }
  if (shouldRedirectBlogToSubdomain()) {
    return blogAbsoluteUrl(path);
  }
  const publicPath = toPublicBlogPath(path);
  if (publicPath === "/") return "/blog";
  return `/blog${publicPath}`;
}

export function blogNavIsExternal() {
  return shouldRedirectBlogToSubdomain();
}

/**
 * Absolute URL on the main site (always https://freetoolspro.in/...).
 * Use from the blog subdomain for logo, tools, and legal links.
 */
export function apexAbsoluteUrl(path = "/") {
  if (!path) return `${APEX_ORIGIN}/`;
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${APEX_ORIGIN}${clean === "/" ? "/" : clean}`;
}

/**
 * In-app href for main-site pages:
 * - blog host → https://freetoolspro.in/...
 * - apex / local → relative path
 */
export function apexNavHref(path = "/") {
  if (typeof window !== "undefined" && isBlogHostname()) {
    return apexAbsoluteUrl(path);
  }
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function apexNavIsExternal() {
  return typeof window !== "undefined" && isBlogHostname();
}
