import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BlogLayout, { formatBlogDate } from "../components/BlogLayout";
import BlogMarkdown from "../components/BlogMarkdown";
import RelatedToolsAside from "../components/RelatedToolsAside";
import BlogCategoryNav from "../components/BlogCategoryNav";
import { getAdjacentPosts, getPostBySlug } from "../data/loadPosts";
import {
  blogAbsoluteUrl,
  blogCategoryPath,
  blogHomePath,
  isBlogHostname,
} from "../data/blogSite";
import { buildBlogPostingSchema } from "../seo/blogSchema";
import { BRAND } from "../../src/seo/brand";

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to={blogHomePath()} replace />;
  }

  const { prev, next } = getAdjacentPosts(post.slug);
  const schema = buildBlogPostingSchema(post);
  const title = `${post.title} | ${BRAND.name}`;
  const description = post.description;
  const categoryPath = blogCategoryPath(post.category);
  const homeCrumb = isBlogHostname()
    ? { label: "Home", href: `${BRAND.url}/` }
    : { label: "Home", to: "/" };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={(post.tags || []).join(", ")} />
        <link rel="canonical" href={blogAbsoluteUrl(post.path)} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={blogAbsoluteUrl(post.path)} />
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
          <Link to={categoryPath} className="hover:underline">
            {post.categoryLabel}
          </Link>
        }
        title={post.title}
        subtitle={post.description}
        breadcrumbs={[
          homeCrumb,
          { label: "Blog", to: blogHomePath() },
          { label: post.categoryLabel, to: categoryPath },
          { label: "Article" },
        ]}
        meta={
          <div className="blog-post-meta">
            <time dateTime={post.date}>Published {formatBlogDate(post.date)}</time>
            {post.updated && post.updated !== post.date ? (
              <>
                <span className="blog-card__dot" aria-hidden="true" />
                <time dateTime={post.updated}>Updated {formatBlogDate(post.updated)}</time>
              </>
            ) : null}
          </div>
        }
        aside={
          <>
            <RelatedToolsAside paths={post.relatedTools} />
            <div className="blog-aside-panel">
              <div className="blog-aside-panel__head">
                <p>On this page</p>
              </div>
              <div className="space-y-2 px-1 pb-1 text-sm text-[var(--ftp-ink-soft)]">
                <p>
                  <span className="font-medium text-[var(--ftp-ink)]">Category</span>
                  <br />
                  <Link to={categoryPath} className="underline-offset-2 hover:underline">
                    {post.categoryLabel}
                  </Link>
                </p>
                {(post.tags || []).length ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(0, 6).map((tag) => (
                      <span key={tag} className="blog-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        }
      >
        <BlogCategoryNav activeSlug={post.category} />

        <article className="blog-article mt-8">
          <BlogMarkdown content={post.content} />
        </article>

        <nav className="blog-pager" aria-label="Adjacent articles">
          {prev ? (
            <Link to={prev.path} className="blog-pager__link">
              <span className="blog-pager__label">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Previous
              </span>
              <span className="blog-pager__title">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={next.path} className="blog-pager__link blog-pager__link--next">
              <span className="blog-pager__label">
                Next
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="blog-pager__title">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </BlogLayout>
    </>
  );
}
