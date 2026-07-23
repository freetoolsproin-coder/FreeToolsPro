import { BRAND, absoluteUrl } from "./brand";
import { breadcrumbFromPath } from "./schemaFactory";

export function buildBlogIndexSchema(posts = []) {
  const url = absoluteUrl("/blog");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["CollectionPage", "Blog"],
        "@id": `${url}#webpage`,
        url,
        name: `Blog | ${BRAND.name}`,
        description: `Tutorials, guides, SEO tips, programming articles, and how-tos from ${BRAND.name}.`,
        isPartOf: { "@id": BRAND.websiteId },
        publisher: { "@id": BRAND.orgId },
        inLanguage: "en-IN",
        blogPost: posts.slice(0, 12).map((post) => ({
          "@type": "BlogPosting",
          "@id": absoluteUrl(post.path),
          headline: post.title,
          datePublished: post.date,
          url: absoluteUrl(post.path),
        })),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.slice(0, 12).map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(post.path),
            name: post.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbFromPath("/blog", "Blog"),
      },
    ],
  };
}

export function buildBlogCategorySchema(category, posts = []) {
  const path = `/blog/category/${category.slug}`;
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: `${category.label} | ${BRAND.name} Blog`,
        description: category.description,
        isPartOf: { "@id": BRAND.websiteId },
        publisher: { "@id": BRAND.orgId },
        inLanguage: "en-IN",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(post.path),
            name: post.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          ...breadcrumbFromPath("/blog", "Blog").slice(0, 2),
          {
            "@type": "ListItem",
            position: 3,
            name: category.label,
            item: url,
          },
        ],
      },
    ],
  };
}

export function buildBlogPostingSchema(post) {
  const url = absoluteUrl(post.path);
  const categoryPath = `/blog/category/${post.category}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
        },
        author: {
          "@type": "Organization",
          "@id": BRAND.orgId,
          name: BRAND.name,
        },
        publisher: {
          "@type": "Organization",
          "@id": BRAND.orgId,
          name: BRAND.name,
          logo: {
            "@type": "ImageObject",
            url: BRAND.logo,
          },
        },
        image: post.cover || `${BRAND.url}/images/seo-preview.png`,
        articleSection: post.categoryLabel || post.category,
        keywords: (post.tags || []).join(", "),
        inLanguage: "en-IN",
        isPartOf: {
          "@type": "Blog",
          "@id": `${absoluteUrl("/blog")}#webpage`,
          name: `${BRAND.name} Blog`,
        },
        url,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: post.title,
        description: post.description,
        isPartOf: { "@id": BRAND.websiteId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: post.cover || `${BRAND.url}/images/seo-preview.png`,
        },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        publisher: { "@id": BRAND.orgId },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BRAND.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: absoluteUrl("/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.categoryLabel || post.category,
            item: absoluteUrl(categoryPath),
          },
          {
            "@type": "ListItem",
            position: 4,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };
}
