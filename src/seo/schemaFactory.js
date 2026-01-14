export const generateSchema = (seo) => {
  if (seo.type === "tool") {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": seo.title,
      "applicationCategory": seo.category,
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FreeToolspro",
    "url": "https://freetoolspro.in/",
  };
};
