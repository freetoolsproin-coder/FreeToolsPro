import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatBlogDate } from "./BlogLayout";

export default function BlogPostCard({ post }) {
  if (!post) return null;

  return (
    <article className="border-b border-[var(--ftp-line)] py-6 first:pt-0 last:border-b-0">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--age-teal-deep,#0f766e)]">
        <Link to={`/blog/category/${post.category}`} className="hover:underline">
          {post.categoryLabel}
        </Link>
        <span className="mx-2 text-[var(--ftp-ink-soft)]">·</span>
        <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
      </p>
      <h2 className="age-display mt-2 text-xl font-semibold tracking-tight text-[var(--ftp-ink)] sm:text-2xl">
        <Link to={post.path} className="transition hover:text-[var(--age-teal-deep,#0f766e)]">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 max-w-2xl text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">
        {post.description}
      </p>
      <Link
        to={post.path}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--ftp-ink)] transition hover:text-[var(--age-teal-deep,#0f766e)]"
      >
        Read article
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </article>
  );
}
