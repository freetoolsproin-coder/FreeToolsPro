import { lazy, Suspense } from "react";
import { shouldRedirectBlogToSubdomain } from "../data/blogSite";

const BlogRoutes = lazy(() => import("./BlogRoutes"));
const BlogSubdomainRedirect = lazy(() => import("./BlogSubdomainRedirect"));

const fallback = (
  <div className="flex min-h-[40vh] items-center justify-center text-[var(--ftp-ink-soft)]">
    Loading…
  </div>
);

/**
 * Local (localhost): render the blog under /blog/* (parent route must end with /*).
 * Live apex (freetoolspro.in): redirect to https://blog.freetoolspro.in/...
 */
export default function BlogApexEntry() {
  if (shouldRedirectBlogToSubdomain()) {
    return (
      <Suspense fallback={fallback}>
        <BlogSubdomainRedirect />
      </Suspense>
    );
  }

  // Direct descendant of /blog/* so BlogRoutes matches the path remainder.
  return (
    <Suspense fallback={fallback}>
      <BlogRoutes />
    </Suspense>
  );
}
