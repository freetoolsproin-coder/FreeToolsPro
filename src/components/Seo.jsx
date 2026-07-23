import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "../seo/seoConfig";
import { generateSchema } from "../seo/schemaFactory";
import { BRAND, absoluteUrl } from "../seo/brand";

/**
 * Page meta + JSON-LD from SEO_CONFIG.
 * Pass faqs / howToSteps / toolName to enrich tool schema when available.
 */
export default function Seo({ page = "home", faqs, howToSteps, toolName }) {
  const seo = SEO_CONFIG[page] ?? SEO_CONFIG.home;
  if (!seo) return null;

  const canonical = absoluteUrl(seo.path);
  const image = seo.image || `${BRAND.url}/images/seo-preview.png`;
  const ogType = seo.type === "tool" ? "website" : seo.type || "website";
  const schema = generateSchema(seo, { faqs, howToSteps, toolName });

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords ? <meta name="keywords" content={seo.keywords} /> : null}
      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={BRAND.name} />
      <meta name="application-name" content={BRAND.name} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={image} />

      <meta name="author" content={BRAND.name} />

      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
