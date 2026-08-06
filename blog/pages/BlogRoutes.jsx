import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { BLOG_SLUG_REDIRECTS } from "../data/slugRedirects";
import { blogHomePath, blogPostPath, isBlogHostname } from "../data/blogSite";
import { getPostBySlug } from "../data/loadPosts";

const BlogIndex = lazy(() => import("./BlogIndex"));
const BlogCategory = lazy(() => import("./BlogCategory"));
const BlogPost = lazy(() => import("./BlogPost"));
const ApexRedirect = lazy(() => import("./ApexRedirect"));

const fallback = (
  <div className="flex min-h-[50vh] items-center justify-center text-[var(--ftp-ink-soft)]">
    Loading…
  </div>
);

/** /articles or /blog/articles → blog home; /articles/foo → /foo (or /blog/foo locally) */
function LegacyArticlesRedirect() {
  const { pathname, search, hash } = useLocation();
  const cleaned = pathname.replace(/\/articles(?=\/|$)/, "") || "/";
  const normalized =
    cleaned === "/" || cleaned === ""
      ? blogHomePath()
      : cleaned.replace(/\/+$/, "") || blogHomePath();
  return <Navigate to={`${normalized}${search || ""}${hash || ""}`} replace />;
}

function BlogSlugGate() {
  const { slug } = useParams();
  const target = slug ? BLOG_SLUG_REDIRECTS[slug] : null;
  if (target) return <Navigate to={blogPostPath(target)} replace />;
  if (slug && !getPostBySlug(slug)) {
    if (isBlogHostname()) {
      return (
        <Suspense fallback={fallback}>
          <ApexRedirect />
        </Suspense>
      );
    }
    return <Navigate to={blogHomePath()} replace />;
  }
  return <BlogPost />;
}

function BlogCatchAll() {
  if (isBlogHostname()) {
    return (
      <Suspense fallback={fallback}>
        <ApexRedirect />
      </Suspense>
    );
  }
  return <Navigate to={blogHomePath()} replace />;
}

/**
 * Nested under /blog/* locally, or /* on blog.freetoolspro.in.
 * Parent route path must end with /* so these match the remainder.
 */
export default function BlogRoutes() {
  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route index element={<BlogIndex />} />
        <Route path="articles" element={<Navigate to={blogHomePath()} replace />} />
        <Route path="articles/*" element={<LegacyArticlesRedirect />} />
        <Route path="category/:category" element={<BlogCategory />} />
        <Route path=":slug" element={<BlogSlugGate />} />
        <Route path="*" element={<BlogCatchAll />} />
      </Routes>
    </Suspense>
  );
}
