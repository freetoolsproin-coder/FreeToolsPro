import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { seoRoutes } from "./config/seoRoutes";

const SITE_URL = "https://freetoolspro.in";

export default function AutoSeo() {
  const { pathname } = useLocation();

  const seo =
    seoRoutes[pathname] ||
    {
      title: "Free Tools – Online Calculators & Utilities",
      description:
        "Free online calculators and tools for health, finance and daily use.",
    };

    const url = `${SITE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      
    </Helmet>
  );
}
