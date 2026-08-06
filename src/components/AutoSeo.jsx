import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { seoRoutes } from "./config/seoRoutes";
import { getSeoByPath } from "../seo/seoByPath";
import { BRAND, absoluteUrl } from "../seo/brand";

/**
 * Fallback title/description/canonical for routes without a dedicated <Seo />.
 * JSON-LD is owned by SoftwareSchema (sitewide) + page-level <Seo /> / FAQ / HowTo.
 */
export default function AutoSeo() {
  const { pathname } = useLocation();
  const fromConfig = getSeoByPath(pathname);

  const seo = fromConfig ||
    seoRoutes[pathname] || {
      title: `${BRAND.name} – Free Online Calculators, SEO & Utility Tools`,
      description: BRAND.description,
    };

  const url = absoluteUrl(pathname === "/" ? "/" : pathname);

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords ? <meta name="keywords" content={seo.keywords} /> : null}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={BRAND.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
    </Helmet>
  );
}
