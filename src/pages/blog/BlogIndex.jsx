import { Helmet } from "react-helmet-async";
import BlogLayout from "../../components/blog/BlogLayout";
import BlogPostCard from "../../components/blog/BlogPostCard";
import BlogCategoryNav from "../../components/blog/BlogCategoryNav";
import { getAllPosts, getBlogCategoryStats, getFeaturedPosts } from "../../data/blog/loadPosts";
import { buildBlogIndexSchema } from "../../seo/blogSchema";
import { BRAND, absoluteUrl } from "../../seo/brand";
import { Link } from "react-router-dom";

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
        <link rel="canonical" href={absoluteUrl("/blog")} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl("/blog")} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Helmet>

      <BlogLayout
        title="Guides & tutorials"
        subtitle="Practical articles on finance calculators, SEO, programming, images, PDFs, and JavaScript—each linked to free tools you can use immediately."
        aside={
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-[var(--ftp-ink)]">Categories</p>
              <ul className="mt-3 space-y-2">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      to={`/blog/category/${cat.slug}`}
                      className="text-sm text-[var(--ftp-ink-soft)] underline-offset-2 hover:text-[var(--ftp-ink)] hover:underline"
                    >
                      {cat.label}
                      <span className="text-[var(--ftp-ink-soft)]/70"> ({cat.count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--ftp-ink)]">Need a tool now?</p>
              <p className="mt-2 text-sm leading-6 text-[var(--ftp-ink-soft)]">
                Skip the article and open the{" "}
                <Link to="/tools" className="underline underline-offset-2">
                  full tools catalog
                </Link>
                .
              </p>
            </div>
          </div>
        }
      >
        <BlogCategoryNav />

        {featured.length ? (
          <div className="mt-10">
            <h2 className="age-display text-lg font-semibold text-[var(--ftp-ink)]">Featured</h2>
            <div className="mt-4">
              {featured.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12">
          <h2 className="age-display text-lg font-semibold text-[var(--ftp-ink)]">
            {remaining.length ? "More articles" : "Latest articles"}
          </h2>
          <div className="mt-4">
            {(remaining.length ? remaining : posts).map((post) => (
              <BlogPostCard key={`all-${post.slug}`} post={post} />
            ))}
          </div>
        </div>
      </BlogLayout>
    </>
  );
}
