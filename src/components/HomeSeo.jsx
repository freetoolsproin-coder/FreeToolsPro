import { Helmet } from "react-helmet-async";

/** Homepage meta without importing the full seoConfig map (~135KB). */
export default function HomeSeo() {
  const title =
    "Free Online Tools - PDF Tools, Image Tools, SEO Tools & Calculators | FreeToolsPro";
  const description =
    "Use FreeToolsPro's free online tools including calculators, PDF tools, image converters, developer utilities, SEO tools and more. Fast, secure and free.";
  const url = "https://freetoolspro.in/";
  const image = "https://freetoolspro.in/images/seo-preview.png";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="FreeToolsPro" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
