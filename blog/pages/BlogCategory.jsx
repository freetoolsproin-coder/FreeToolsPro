import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import BlogLayout from "../components/BlogLayout";
import BlogPostCard from "../components/BlogPostCard";
import BlogCategoryNav from "../components/BlogCategoryNav";
import { getCategory, getPostsByCategory } from "../data/loadPosts";
import {
  blogAbsoluteUrl,
  blogCategoryPath,
  blogHomePath,
  isBlogHostname,
} from "../data/blogSite";
import { buildBlogCategorySchema } from "../seo/blogSchema";
import { BRAND } from "../../src/seo/brand";

export default function BlogCategory() {
  const { category: categorySlug } = useParams();
  const category = getCategory(categorySlug);

  if (!category) {
    return <Navigate to={blogHomePath()} replace />;
  }

  const posts = getPostsByCategory(category.slug);
  const schema = buildBlogCategorySchema(category, posts);
  const path = blogCategoryPath(category.slug);
  const title = `${category.label} | ${BRAND.name} Blog`;
  const description = category.description;
  const homeCrumb = isBlogHostname()
    ? { label: "Home", href: `${BRAND.url}/` }
    : { label: "Home", to: "/" };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={blogAbsoluteUrl(path)} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={blogAbsoluteUrl(path)} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Helmet>

      <BlogLayout
        eyebrow="Category"
        title={category.label}
        subtitle={category.description}
        breadcrumbs={[homeCrumb, { label: "Blog", to: blogHomePath() }, { label: category.label }]}
        meta={
          <span className="blog-stat-pill">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </span>
        }
        aside={
          <div className="blog-aside-cta">
            <p className="blog-aside-cta__title">More on the blog</p>
            <p className="blog-aside-cta__body">
              Browse every topic, or jump using the chips below.
            </p>
            <Link to={blogHomePath()} className="blog-aside-cta__btn">
              All articles
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        }
      >
        <BlogCategoryNav activeSlug={category.slug} />

        <div className="mt-10">
          {posts.length ? (
            <div className="blog-card-grid">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <p>No articles in this category yet.</p>
              <Link to={blogHomePath()} className="blog-link-quiet">
                Back to all articles
              </Link>
            </div>
          )}
        </div>
      </BlogLayout>
    </>
  );
}
