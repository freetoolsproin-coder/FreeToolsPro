import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function formatBlogDate(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function BlogLayout({
  eyebrow = "Blog",
  title,
  subtitle,
  children,
  aside,
  breadcrumbs,
  meta,
}) {
  const crumbs = breadcrumbs?.length
    ? breadcrumbs
    : [
        { label: "Home", to: "/" },
        { label: "Blog", to: "/blog" },
      ];

  return (
    <main className="ftp-page blog-page">
      <section className="blog-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="blog-breadcrumb">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1.5">
                  {i > 0 ? (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--ftp-ink-soft)]/50" aria-hidden="true" />
                  ) : null}
                  {last || !crumb.to ? (
                    <span className="text-[var(--ftp-ink-soft)]">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.to} className="transition hover:text-[var(--ftp-ink)]">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          {eyebrow ? <div className="blog-kicker">{eyebrow}</div> : null}

          <h1 className="blog-hero__title">{title}</h1>

          {subtitle ? <p className="blog-hero__subtitle">{subtitle}</p> : null}

          {meta ? <div className="blog-hero__meta">{meta}</div> : null}

          <div className="blog-hero__actions">
            <Link to="/blog" className="blog-link-quiet">
              All articles
            </Link>
            <span className="text-[var(--ftp-line-strong)]" aria-hidden="true">
              /
            </span>
            <Link to="/tools" className="blog-link-quiet">
              Browse tools
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-2 sm:px-6 lg:px-8">
        {aside ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-12 lg:items-start">
            <div className="min-w-0">{children}</div>
            <aside className="min-w-0 space-y-4 self-start lg:sticky lg:top-24">{aside}</aside>
          </div>
        ) : (
          children
        )}
      </section>
    </main>
  );
}
