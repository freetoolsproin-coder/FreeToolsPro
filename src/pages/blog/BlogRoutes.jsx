import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { BLOG_SLUG_REDIRECTS } from "../../data/blog/slugRedirects";

const BlogIndex = lazy(() => import("./BlogIndex"));
const BlogCategory = lazy(() => import("./BlogCategory"));
const BlogPost = lazy(() => import("./BlogPost"));

const fallback = (
  <div className="flex min-h-[50vh] items-center justify-center text-[var(--ftp-ink-soft)]">
    Loading…
  </div>
);

function BlogSlugGate() {
  const { slug } = useParams();
  const target = slug ? BLOG_SLUG_REDIRECTS[slug] : null;
  if (target) return <Navigate to={`/blog/${target}`} replace />;
  return <BlogPost />;
}

/**
 * Nested under /blog/* so index ("/blog") never competes with ":slug".
 */
export default function BlogRoutes() {
  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route index element={<BlogIndex />} />
        <Route path="category/:category" element={<BlogCategory />} />
        <Route path=":slug" element={<BlogSlugGate />} />
        <Route path="*" element={<Navigate to="/blog" replace />} />
      </Routes>
    </Suspense>
  );
}
