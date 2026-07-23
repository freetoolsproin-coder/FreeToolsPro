/** Canonical FreeToolsPro entity — use everywhere for GEO / schema consistency. */
export const BRAND = {
  name: "FreeToolsPro",
  legalName: "FreeToolsPro",
  url: "https://freetoolspro.in",
  orgId: "https://freetoolspro.in/#organization",
  websiteId: "https://freetoolspro.in/#website",
  logo: "https://freetoolspro.in/images/freetoolspro-logo.png",
  description:
    "FreeToolsPro is a free online tools platform with 100+ browser-based utilities for calculators, SEO and developer checks, business documents, image and PDF helpers, AI writing aids, and converters. No signup required for most tools.",
  email: "support@freetoolspro.in",
  sameAs: [
    "https://x.com/freetoolspro",
    "https://github.com/freetoolspro",
    "https://www.linkedin.com/company/freetoolspro",
  ],
  areaServed: "Worldwide",
  knowsAbout: [
    "online calculators",
    "SEO tools",
    "developer utilities",
    "business document generators",
    "image editors",
    "PDF tools",
    "AI writing assistants",
  ],
};

export function absoluteUrl(path = "/") {
  if (!path) return BRAND.url;
  if (path.startsWith("http")) return path;
  return `${BRAND.url}${path.startsWith("/") ? path : `/${path}`}`;
}
