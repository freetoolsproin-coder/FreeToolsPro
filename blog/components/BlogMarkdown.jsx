import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { BRAND } from "../../src/seo/brand";
import { blogCategoryPath, blogHomePath, blogPostPath, isBlogHostname } from "../data/blogSite";

function isApexSitePath(href) {
  return (
    href === "/tools" ||
    href === "/contact" ||
    href === "/about" ||
    href.startsWith("/calculators/") ||
    href.startsWith("/tools/") ||
    href.startsWith("/business-tools/") ||
    href.startsWith("/developer-tools/") ||
    href.startsWith("/image-tools/") ||
    href.startsWith("/pdf-tools/") ||
    href.startsWith("/text-tools/") ||
    href.startsWith("/trending-tools/") ||
    href.startsWith("/trending/") ||
    href.startsWith("/social-media-tools/") ||
    href.startsWith("/ai-") ||
    href.includes("-tools/") ||
    href.startsWith("/loan-") ||
    href.startsWith("/tax-") ||
    href.startsWith("/salary-") ||
    href.startsWith("/mutual-") ||
    href.startsWith("/banking-") ||
    href.startsWith("/insurance-") ||
    href.startsWith("/retirement-") ||
    href.startsWith("/business-finance/") ||
    href.startsWith("/json-") ||
    href.startsWith("/html-") ||
    href.startsWith("/css-") ||
    href.startsWith("/javascript-") ||
    href.startsWith("/api-") ||
    href.startsWith("/jwt-") ||
    href.startsWith("/encoding-") ||
    href.startsWith("/hash-") ||
    href.startsWith("/security-") ||
    href.startsWith("/http-") ||
    href.startsWith("/seo-")
  );
}

function MarkdownLink({ href = "", children }) {
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  if (!href.startsWith("/")) {
    return <a href={href}>{children}</a>;
  }

  const blogHost = isBlogHostname();

  if (
    href === "/blog" ||
    href === "/blog/" ||
    href === "/articles" ||
    href === "/articles/" ||
    href === "/blog/articles" ||
    href === "/blog/articles/"
  ) {
    return <Link to={blogHomePath()}>{children}</Link>;
  }

  if (href.startsWith("/blog/articles/category/") || href.startsWith("/articles/category/") || href.startsWith("/blog/category/")) {
    const category = href.split("/category/")[1]?.split("/")[0];
    if (category) return <Link to={blogCategoryPath(category)}>{children}</Link>;
  }

  if (href.startsWith("/blog/articles/") || href.startsWith("/articles/")) {
    const slug = href.replace(/^\/(?:blog\/)?articles\//, "").split("/")[0];
    if (slug && slug !== "category") return <Link to={blogPostPath(slug)}>{children}</Link>;
  }

  if (href.startsWith("/blog/")) {
    const slug = href.slice("/blog/".length).split("/")[0];
    if (slug && slug !== "category" && slug !== "articles") {
      return <Link to={blogPostPath(slug)}>{children}</Link>;
    }
  }

  if (blogHost && isApexSitePath(href)) {
    return <a href={`${BRAND.url}${href}`}>{children}</a>;
  }

  return <Link to={href}>{children}</Link>;
}

export default function BlogMarkdown({ content }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: MarkdownLink,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
