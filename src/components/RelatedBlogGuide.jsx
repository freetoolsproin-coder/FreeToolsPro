import { BookOpen, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getToolBlogGuideSlug } from "../data/toolBlogGuides";
import { blogNavHref, blogNavIsExternal, blogPostPath } from "../../blog/data/blogSite";

/**
 * Sidebar card linking the current tool to its blog guide.
 */
export default function RelatedBlogGuide({ currentToolPath, toolName }) {
  const slug = getToolBlogGuideSlug(currentToolPath);
  if (!slug) return null;

  // blogNavHref wants a public blog path; blogPostPath is host-aware for in-app Link.
  const href = blogNavIsExternal() ? blogNavHref(`/${slug}`) : blogPostPath(slug);
  const external = blogNavIsExternal();
  const label = toolName ? `Read the ${toolName} guide` : "Read the guide";

  const className =
    "group flex items-start gap-3 rounded-[1.25rem] border border-[var(--ftp-line)] bg-white/70 p-5 shadow-[0_16px_40px_rgba(7,16,31,0.05)] backdrop-blur-sm transition hover:border-[var(--hero-accent,theme(colors.teal.600))]";

  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <BookOpen className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ftp-ink-soft)]">
          Blog guide
        </span>
        <span className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-[var(--ftp-ink)] group-hover:text-teal-800">
          {label}
          <ArrowUpRight
            className="h-3.5 w-3.5 shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span className="mt-1 block text-xs leading-5 text-[var(--ftp-ink-soft)]">
          Steps, tips, and when to use this tool.
        </span>
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={className} rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {inner}
    </Link>
  );
}
