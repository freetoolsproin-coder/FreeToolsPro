import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "../seo/seoConfig";
import { generateSchema } from "../seo/schemaFactory";

export default function Seo({ page = "home" }) {
  const seo = SEO_CONFIG[page] ?? SEO_CONFIG.home;
  if (!seo) return null;

  const canonical = `https://freetoolspro.in${seo.path}`;

  return (
    <Helmet>
      {/* Title */}
      <title>{seo.title}</title>

      {/* Meta */}
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={seo.type || "website"} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content="/images/seo-preview.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />

      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchema(seo))}
      </script>
    </Helmet>
  );
}
