import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import BlogLayout, { formatBlogDate } from "../../components/blog/BlogLayout";
import BlogMarkdown from "../../components/blog/BlogMarkdown";
import RelatedToolsAside from "../../components/blog/RelatedToolsAside";
import BlogCategoryNav from "../../components/blog/BlogCategoryNav";
import { getAdjacentPosts, getPostBySlug } from "../../data/blog/loadPosts";
import { buildBlogPostingSchema } from "../../seo/blogSchema";
import { BRAND, absoluteUrl } from "../../seo/brand";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const { prev, next } = getAdjacentPosts(post.slug);
  const schema = buildBlogPostingSchema(post);
  const title = `${post.title} | ${BRAND.name}`;
  const description = post.description;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={(post.tags || []).join(", ")} />
        <link rel="canonical" href={absoluteUrl(post.path)} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl(post.path)} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:modified_time" content={post.updated || post.date} />
        <meta property="article:section" content={post.categoryLabel} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Helmet>

      <BlogLayout
        eyebrow={
          <Link to={`/blog/category/${post.category}`} className="hover:underline">
            {post.categoryLabel}
          </Link>
        }
        title={post.title}
        subtitle={post.description}
        aside={
          <div className="space-y-6">
            <RelatedToolsAside paths={post.relatedTools} />
            <div className="text-sm text-[var(--ftp-ink-soft)]">
              <p>
                Published <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              </p>
              {post.updated && post.updated !== post.date ? (
                <p className="mt-1">
                  Updated <time dateTime={post.updated}>{formatBlogDate(post.updated)}</time>
                </p>
              ) : null}
            </div>
          </div>
        }
      >
        <BlogCategoryNav activeSlug={post.category} />

        <article className="mt-10 max-w-3xl">
          <BlogMarkdown content={post.content} />
        </article>

        <nav
          className="mt-14 flex flex-col gap-4 border-t border-[var(--ftp-line)] pt-8 sm:flex-row sm:justify-between"
          aria-label="Adjacent articles"
        >
          {prev ? (
            <Link to={prev.path} className="group max-w-sm text-sm">
              <span className="text-[var(--ftp-ink-soft)]">Previous</span>
              <span className="mt-1 block font-semibold text-[var(--ftp-ink)] group-hover:underline">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={next.path} className="group max-w-sm text-sm sm:text-right">
              <span className="text-[var(--ftp-ink-soft)]">Next</span>
              <span className="mt-1 block font-semibold text-[var(--ftp-ink)] group-hover:underline">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      </BlogLayout>
    </>
  );
}
