import { Link } from "react-router-dom";
import { BLOG_CATEGORIES } from "../../data/blog/categories";

export default function BlogCategoryNav({ activeSlug }) {
  return (
    <nav aria-label="Blog categories" className="flex flex-wrap gap-2">
      <Link
        to="/blog"
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          !activeSlug
            ? "bg-[var(--ftp-ink)] text-white"
            : "border border-[var(--ftp-line)] bg-white/70 text-[var(--ftp-ink-soft)] hover:border-[var(--ftp-ink)] hover:text-[var(--ftp-ink)]"
        }`}
      >
        All
      </Link>
      {BLOG_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          to={`/blog/category/${cat.slug}`}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            activeSlug === cat.slug
              ? "bg-[var(--ftp-ink)] text-white"
              : "border border-[var(--ftp-line)] bg-white/70 text-[var(--ftp-ink-soft)] hover:border-[var(--ftp-ink)] hover:text-[var(--ftp-ink)]"
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </nav>
  );
}
