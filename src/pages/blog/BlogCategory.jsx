import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import BlogLayout from "../../components/blog/BlogLayout";
import BlogPostCard from "../../components/blog/BlogPostCard";
import BlogCategoryNav from "../../components/blog/BlogCategoryNav";
import { getCategory, getPostsByCategory } from "../../data/blog/loadPosts";
import { buildBlogCategorySchema } from "../../seo/blogSchema";
import { BRAND, absoluteUrl } from "../../seo/brand";

export default function BlogCategory() {
  const { category: categorySlug } = useParams();
  const category = getCategory(categorySlug);

  if (!category) {
    return <Navigate to="/blog" replace />;
  }

  const posts = getPostsByCategory(category.slug);
  const schema = buildBlogCategorySchema(category, posts);
  const path = `/blog/category/${category.slug}`;
  const title = `${category.label} | ${BRAND.name} Blog`;
  const description = category.description;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl(path)} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl(path)} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Helmet>

      <BlogLayout
        eyebrow="Category"
        title={category.label}
        subtitle={category.description}
        aside={
          <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--ftp-ink)]">More on the blog</p>
            <p className="mt-2 text-sm leading-6 text-[var(--ftp-ink-soft)]">
              Browse{" "}
              <Link to="/blog" className="underline underline-offset-2">
                all articles
              </Link>{" "}
              or jump to another topic from the chips below.
            </p>
          </div>
        }
      >
        <BlogCategoryNav activeSlug={category.slug} />

        <div className="mt-10">
          {posts.length ? (
            posts.map((post) => <BlogPostCard key={post.slug} post={post} />)
          ) : (
            <p className="text-[var(--ftp-ink-soft)]">No articles in this category yet.</p>
          )}
        </div>
      </BlogLayout>
    </>
  );
}
