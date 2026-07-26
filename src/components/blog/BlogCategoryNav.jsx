import { Link } from "react-router-dom";
import { BLOG_CATEGORIES } from "../../data/blog/categories";

export default function BlogCategoryNav({ activeSlug }) {
  return (
    <nav aria-label="Blog categories" className="blog-cat-nav">
      <Link to="/blog" className={`ftp-chip${!activeSlug ? " ftp-chip--active" : ""}`}>
        All
      </Link>
      {BLOG_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          to={`/blog/category/${cat.slug}`}
          className={`ftp-chip${activeSlug === cat.slug ? " ftp-chip--active" : ""}`}
        >
          {cat.label}
        </Link>
      ))}
    </nav>
  );
}
