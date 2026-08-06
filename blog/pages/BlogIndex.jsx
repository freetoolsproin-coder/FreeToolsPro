import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import BlogLayout from "../components/BlogLayout";
import BlogPostCard from "../components/BlogPostCard";
import BlogCategoryNav from "../components/BlogCategoryNav";
import { getAllPosts, getBlogCategoryStats, getFeaturedPosts } from "../data/loadPosts";
import {
  apexNavHref,
  apexNavIsExternal,
  blogAbsoluteUrl,
  blogCategoryPath,
  blogHomePath,
} from "../data/blogSite";
import { buildBlogIndexSchema } from "../seo/blogSchema";
import { BRAND } from "../../src/seo/brand";

export default function BlogIndex() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts(3);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const remaining = posts.filter((p) => !featuredSlugs.has(p.slug));
  const categories = getBlogCategoryStats();
  const schema = buildBlogIndexSchema(posts);

  const title = `Blog | Tutorials, Guides & Tips | ${BRAND.name}`;
  const description =
    "FreeToolsPro blog: tutorials, guides, programming tips, SEO checklists, image optimization, PDF how-tos, and JavaScript articles—linked to free online tools.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={blogAbsoluteUrl(blogHomePath())} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={blogAbsoluteUrl(blogHomePath())} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Helmet>

      <BlogLayout
        eyebrow="FreeToolsPro Blog"
        title="Guides & tutorials"
        subtitle="Practical articles on calculators, SEO, programming, images, PDFs, and JavaScript—each linked to free tools you can use right away."
        meta={
          <span className="blog-stat-pill">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {posts.length} articles
          </span>
        }
        aside={
          <>
            <div className="blog-aside-panel">
              <div className="blog-aside-panel__head">
                <p>Categories</p>
              </div>
              <ul className="blog-aside-panel__list">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link to={blogCategoryPath(cat.slug)} className="blog-aside-panel__link">
                      <span>{cat.label}</span>
                      <span className="blog-aside-count">{cat.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="blog-aside-cta">
              <p className="blog-aside-cta__title">Need a tool now?</p>
              <p className="blog-aside-cta__body">
                Skip the reading and open the full catalog.
              </p>
              {apexNavIsExternal() ? (
                <a href={apexNavHref("/tools")} className="blog-aside-cta__btn">
                  Browse tools
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : (
                <Link to="/tools" className="blog-aside-cta__btn">
                  Browse tools
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </>
        }
      >
        <BlogCategoryNav />

        {featured.length ? (
          <div className="mt-10">
            <div className="blog-section-head">
              <h2>Featured</h2>
            </div>
            <div className="blog-card-grid blog-card-grid--featured mt-5">
              {featured.map((post) => (
                <BlogPostCard key={post.slug} post={post} featured />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12">
          <div className="blog-section-head">
            <h2>{remaining.length ? "More articles" : "Latest articles"}</h2>
          </div>
          <div className="blog-card-grid mt-5">
            {(remaining.length ? remaining : posts).map((post) => (
              <BlogPostCard key={`all-${post.slug}`} post={post} />
            ))}
          </div>
        </div>
      </BlogLayout>
    </>
  );
}
