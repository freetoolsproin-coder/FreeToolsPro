import { BRAND, absoluteUrl } from "./brand";

const CATEGORY_LABELS = {
  calculators: "Calculators",
  "text-tools": "Text Tools",
  "developer-tools": "Developer Tools",
  "image-tools": "Image Tools",
  "pdf-tools": "PDF Tools",
  "business-tools": "Business Tools",
  "social-media-tools": "Social Media Tools",
  "trending-tools": "Trending Tools",
};

/** Map free-form seoConfig categories to schema.org SoftwareApplication values. */
const APPLICATION_CATEGORY_MAP = {
  UtilityApplication: "UtilitiesApplication",
  UtilitiesApplication: "UtilitiesApplication",
  Utility: "UtilitiesApplication",
  ContentCreation: "BusinessApplication",
  MediaApplication: "MultimediaApplication",
  MultimediaApplication: "MultimediaApplication",
  DocumentApplication: "BusinessApplication",
  DeveloperApplication: "DeveloperApplication",
  FinanceApplication: "FinanceApplication",
  HealthApplication: "HealthApplication",
  SecurityApplication: "SecurityApplication",
  BusinessApplication: "BusinessApplication",
  EducationalApplication: "EducationalApplication",
  LifestyleApplication: "LifestyleApplication",
  ReferenceApplication: "ReferenceApplication",
};

function titleCaseSeg(seg) {
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeApplicationCategory(category) {
  if (!category) return "UtilitiesApplication";
  return APPLICATION_CATEGORY_MAP[category] || "UtilitiesApplication";
}

export function breadcrumbFromPath(path, pageName) {
  const segments = (path || "/").split("/").filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BRAND.url}/`,
    },
  ];

  if (segments.length === 0) return items;

  let href = "";
  segments.forEach((seg, i) => {
    href += `/${seg}`;
    const isLast = i === segments.length - 1;
    const label = isLast
      ? pageName || titleCaseSeg(seg)
      : CATEGORY_LABELS[seg] || titleCaseSeg(seg);
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: label,
      item: absoluteUrl(href),
    });
  });

  return items;
}

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": BRAND.orgId,
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: BRAND.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${BRAND.url}/#logo`,
      url: BRAND.logo,
      caption: BRAND.name,
    },
    image: BRAND.logo,
    description: BRAND.description,
    email: BRAND.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: BRAND.email,
        url: absoluteUrl("/contact"),
        availableLanguage: ["English", "en-IN"],
      },
    ],
    sameAs: BRAND.sameAs,
    areaServed: BRAND.areaServed,
    knowsAbout: BRAND.knowsAbout,
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": BRAND.websiteId,
    name: BRAND.name,
    url: BRAND.url,
    description: BRAND.description,
    publisher: { "@id": BRAND.orgId },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BRAND.url}/tools?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function shortToolName(seo) {
  if (seo.toolName) return seo.toolName;
  const title = seo.title || "FreeToolsPro Tool";
  return title.split(":")[0].split("|")[0].trim();
}

function featureListFromSeo(seo) {
  if (Array.isArray(seo.featureList) && seo.featureList.length) return seo.featureList;
  const raw = (seo.keywords || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 8);
  return raw.length ? raw : undefined;
}

/**
 * Sitewide Organization + WebSite + WebApplication graph.
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      websiteNode(),
      {
        "@type": "WebApplication",
        "@id": `${BRAND.url}/#webapp`,
        name: BRAND.name,
        url: BRAND.url,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "Online Tools Platform",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        description: BRAND.description,
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
        provider: { "@id": BRAND.orgId },
        publisher: { "@id": BRAND.orgId },
        isPartOf: { "@id": BRAND.websiteId },
        inLanguage: "en-IN",
        featureList: BRAND.knowsAbout,
      },
    ],
  };
}

function buildHowTo(name, url, steps = []) {
  if (!steps.length) return null;
  return {
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: `How to use ${name}`,
    description: `Step-by-step instructions for ${name} on ${BRAND.name}.`,
    totalTime: "PT2M",
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title || `Step ${i + 1}`,
      text: step.body || step.text || "",
      url: `${url}#step-${i + 1}`,
    })),
  };
}

/**
 * Primary JSON-LD for <Seo /> pages.
 * @param {object} seo - entry from SEO_CONFIG
 * @param {object} [extras] - { faqs, howToSteps, toolName }
 */
export const generateSchema = (seo, extras = {}) => {
  const path = seo.path || "/";
  const url = absoluteUrl(path);
  const image = seo.image || `${BRAND.url}/images/seo-preview.png`;
  const faqs = extras.faqs || seo.faqs || [];
  const howToSteps = extras.howToSteps || seo.howToSteps || [];
  const name = shortToolName({ ...seo, toolName: extras.toolName });

  if (path === "/" || seo.schemaType === "home") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: seo.title,
          description: seo.description,
          isPartOf: { "@id": BRAND.websiteId },
          about: { "@id": `${BRAND.url}/#webapp` },
          publisher: { "@id": BRAND.orgId },
          inLanguage: "en-IN",
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: image,
          },
        },
      ],
    };
  }

  if (seo.type === "tool") {
    const appCategory = normalizeApplicationCategory(seo.category);
    const graph = [
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "@id": `${url}#tool`,
        name,
        alternateName: seo.title,
        description: seo.description,
        url,
        image,
        applicationCategory: appCategory,
        applicationSubCategory: path.split("/")[1]
          ? titleCaseSeg(path.split("/")[1])
          : "Online Tool",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
        provider: { "@id": BRAND.orgId },
        publisher: { "@id": BRAND.orgId },
        creator: { "@id": BRAND.orgId },
        isPartOf: { "@id": BRAND.websiteId },
        inLanguage: "en-IN",
        countriesSupported: "IN,Worldwide",
        featureList: featureListFromSeo(seo),
        keywords: seo.keywords,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": BRAND.websiteId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: image,
        },
        mainEntity: { "@id": `${url}#tool` },
        about: { "@id": `${url}#tool` },
        publisher: { "@id": BRAND.orgId },
        inLanguage: "en-IN",
        breadcrumb: { "@id": `${url}#breadcrumb` },
        potentialAction: {
          "@type": "UseAction",
          target: url,
          name: `Use ${name}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbFromPath(path, name),
      },
    ];

    const howTo = buildHowTo(name, url, howToSteps);
    if (howTo) graph.push(howTo);

    if (faqs.length) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
        isPartOf: { "@id": `${url}#webpage` },
      });
    }

    return { "@context": "https://schema.org", "@graph": graph };
  }

  const pageType =
    seo.schemaType ||
    (path === "/about"
      ? "AboutPage"
      : path === "/contact"
        ? "ContactPage"
        : "WebPage");

  const graph = [
    {
      "@type": pageType,
      "@id": `${url}#webpage`,
      url,
      name: seo.title,
      description: seo.description,
      isPartOf: { "@id": BRAND.websiteId },
      publisher: { "@id": BRAND.orgId },
      inLanguage: "en-IN",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: image,
      },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: breadcrumbFromPath(path, seo.title?.split("|")[0]?.trim() || seo.title),
    },
  ];

  if (path === "/contact") {
    graph.push({
      "@type": "Organization",
      "@id": `${url}#contact-org`,
      name: BRAND.name,
      email: BRAND.email,
      url: BRAND.url,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: BRAND.email,
        url: absoluteUrl("/contact"),
        availableLanguage: ["English"],
      },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
};

export function buildFaqSchema(faqs = [], pageUrl) {
  if (!faqs.length) return null;
  const url = pageUrl ? absoluteUrl(pageUrl) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(url ? { "@id": `${url}#faq`, url } : {}),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function buildHowToSchema({ name, description, url, steps = [] }) {
  const pageUrl = url ? absoluteUrl(url) : BRAND.url;
  const howTo = buildHowTo(name, pageUrl, steps);
  if (!howTo) return null;
  return {
    "@context": "https://schema.org",
    ...howTo,
    description: description || howTo.description,
  };
}

export function buildDefinedTermSchema({ name, description, url }) {
  if (!name || !description) return null;
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name,
    description,
    url: url || undefined,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `${BRAND.name} tool glossary`,
      url: absoluteUrl("/tools"),
    },
  };
}
