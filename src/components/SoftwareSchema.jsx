import { Helmet } from "react-helmet-async";

export default function SoftwareSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Free Tools",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "description":
      "Free online calculators and tools for health, finance and everyday use.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
