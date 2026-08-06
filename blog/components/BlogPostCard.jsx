import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatBlogDate } from "./BlogLayout";
import { blogCategoryPath } from "../data/blogSite";

export default function BlogPostCard({ post, featured = false }) {
  if (!post) return null;

  return (
    <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
      <div className="blog-card__meta">
        <Link to={blogCategoryPath(post.category)} className="blog-card__category">
          {post.categoryLabel}
        </Link>
        <span className="blog-card__dot" aria-hidden="true" />
        <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
      </div>

      <h2 className="blog-card__title">
        <Link to={post.path}>{post.title}</Link>
      </h2>

      <p className="blog-card__desc">{post.description}</p>

      <Link to={post.path} className="blog-card__cta">
        Read article
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </article>
  );
}
