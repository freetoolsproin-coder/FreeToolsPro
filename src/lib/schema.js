// Shared JSON-LD builders for plain pages (about, contact, policies, the tools index, ebooks).
import { SITE } from "../data/site.js";
import { AUTHOR } from "../data/author.js";
import { CATEGORIES } from "../data/catalog.js";
import { ABOUT } from "../data/home.js";

/** The ebooks' author. Used only on the ebooks page. */
export const personJsonLd = () => ({
  "@type": "Person",
  "@id": `${SITE.url}/about#author`,
  name: AUTHOR.name,
  jobTitle: AUTHOR.role,
  description: AUTHOR.bio[0],
  knowsAbout: ["UI architecture", "UX strategy", "Front-end performance optimization", "React", "JavaScript", "Node.js", "Web applications"],
  url: `${SITE.url}/about`,
  worksFor: { "@id": `${SITE.url}/#organization` },
});

export const breadcrumbJsonLd = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE.url + path })),
});

/** WebPage (or a subtype such as AboutPage / ContactPage) plus a Home > Page breadcrumb. */
export function webPageJsonLd({ type = "WebPage", path, name, description, extra = {} }) {
  return [
    {
      "@context": "https://schema.org",
      "@type": type,
      "@id": `${SITE.url}${path}#webpage`,
      url: SITE.url + path,
      name,
      description,
      inLanguage: "en-IN",
      dateModified: SITE.updated,
      isPartOf: { "@id": `${SITE.url}/#website` },
      publisher: { "@id": `${SITE.url}/#organization` },
      ...extra,
    },
    breadcrumbJsonLd([["Home", "/"], [name, path]]),
  ];
}

/** The Organization node. Used in full on the home and about pages. */
export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: ["Free Tools Pro", "freetoolspro.in"],
  slogan: SITE.tagline,
  url: SITE.url,
  logo: { "@type": "ImageObject", url: `${SITE.url}/icon-512.png`, width: 512, height: 512 },
  email: SITE.email,
  description: ABOUT,
  areaServed: { "@type": "Country", name: "India" },
  knowsAbout: CATEGORIES.map((c) => c.name),
  ...(Object.values(SITE.social || {}).some(Boolean) ? { sameAs: Object.values(SITE.social).filter(Boolean) } : {}),
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: SITE.email, url: `${SITE.url}/contact` },
});
