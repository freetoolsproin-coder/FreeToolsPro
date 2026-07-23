import { Link } from "react-router-dom";

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
}) {
  return (
    <main className="ftp-page blog-page">
      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--age-teal-deep,#0f766e)]">
          {eyebrow}
        </div>
        <h1 className="age-display mt-3 max-w-3xl text-[clamp(1.85rem,4.2vw,3rem)] font-semibold leading-[1.1] text-[var(--ftp-ink)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-7 text-[var(--ftp-ink-soft)]">{subtitle}</p>
        ) : null}
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">
          <Link to="/blog" className="underline-offset-2 hover:underline">
            All articles
          </Link>
          {" · "}
          <Link to="/tools" className="underline-offset-2 hover:underline">
            Browse tools
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {aside ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16 lg:items-start">
            <div className="min-w-0">{children}</div>
            <aside className="min-w-0 self-start lg:sticky lg:top-24 lg:pt-1">{aside}</aside>
          </div>
        ) : (
          children
        )}
      </section>
    </main>
  );
}
