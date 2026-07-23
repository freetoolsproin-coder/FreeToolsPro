import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Check, Clipboard, Download, FileJson, RefreshCcw } from "lucide-react";
import ExploreRelatedTools from "../../components/ExploreRelatedTools";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const schemaDefaults = {
  Article: {
    headline: "How to Build Better Web Pages",
    description: "A practical guide with examples and SEO-friendly structure.",
    authorName: "FreeToolsPro",
    publisherName: "FreeToolsPro",
    image: "https://freetoolspro.in/og-image.jpg",
    url: "https://freetoolspro.in/blog/example",
    datePublished: "2026-01-01",
  },
  FAQPage: {
    questionOne: "What is schema markup?",
    answerOne: "Schema markup is structured data that helps search engines understand page content.",
    questionTwo: "Where should JSON-LD be added?",
    answerTwo: "Add it inside a script tag in the page head or body.",
  },
  Product: {
    name: "Premium SEO Toolkit",
    description: "A browser-based toolkit for improving website visibility.",
    image: "https://freetoolspro.in/product.jpg",
    brand: "FreeToolsPro",
    price: "49.00",
    currency: "USD",
    availability: "https://schema.org/InStock",
    rating: "4.8",
    reviewCount: "128",
  },
  LocalBusiness: {
    name: "FreeToolsPro",
    description: "Online tools for creators, developers, and marketers.",
    url: "https://freetoolspro.in",
    phone: "+1-555-0100",
    street: "123 Market Street",
    city: "New York",
    region: "NY",
    postalCode: "10001",
    country: "US",
  },
  Website: {
    name: "FreeToolsPro",
    url: "https://freetoolspro.in",
    searchUrl: "https://freetoolspro.in/tools?search={search_term_string}",
  },
};

const fieldLabels = {
  headline: "Headline",
  description: "Description",
  authorName: "Author name",
  publisherName: "Publisher name",
  image: "Image URL",
  url: "Page URL",
  datePublished: "Published date",
  questionOne: "Question 1",
  answerOne: "Answer 1",
  questionTwo: "Question 2",
  answerTwo: "Answer 2",
  name: "Name",
  brand: "Brand",
  price: "Price",
  currency: "Currency",
  availability: "Availability URL",
  rating: "Rating",
  reviewCount: "Review count",
  phone: "Phone",
  street: "Street address",
  city: "City",
  region: "State / region",
  postalCode: "Postal code",
  country: "Country",
  searchUrl: "Search URL template",
};

const buildSchema = (type, values) => {
  const context = "https://schema.org";

  if (type === "Article") {
    return {
      "@context": context,
      "@type": "Article",
      headline: values.headline,
      description: values.description,
      image: values.image,
      url: values.url,
      datePublished: values.datePublished,
      author: {
        "@type": "Person",
        name: values.authorName,
      },
      publisher: {
        "@type": "Organization",
        name: values.publisherName,
      },
    };
  }

  if (type === "FAQPage") {
    return {
      "@context": context,
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: values.questionOne,
          acceptedAnswer: {
            "@type": "Answer",
            text: values.answerOne,
          },
        },
        {
          "@type": "Question",
          name: values.questionTwo,
          acceptedAnswer: {
            "@type": "Answer",
            text: values.answerTwo,
          },
        },
      ],
    };
  }

  if (type === "Product") {
    return {
      "@context": context,
      "@type": "Product",
      name: values.name,
      description: values.description,
      image: values.image,
      brand: {
        "@type": "Brand",
        name: values.brand,
      },
      offers: {
        "@type": "Offer",
        priceCurrency: values.currency,
        price: values.price,
        availability: values.availability,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: values.rating,
        reviewCount: values.reviewCount,
      },
    };
  }

  if (type === "LocalBusiness") {
    return {
      "@context": context,
      "@type": "LocalBusiness",
      name: values.name,
      description: values.description,
      url: values.url,
      telephone: values.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: values.street,
        addressLocality: values.city,
        addressRegion: values.region,
        postalCode: values.postalCode,
        addressCountry: values.country,
      },
    };
  }

  return {
    "@context": context,
    "@type": "WebSite",
    name: values.name,
    url: values.url,
    potentialAction: {
      "@type": "SearchAction",
      target: values.searchUrl,
      "query-input": "required name=search_term_string",
    },
  };
};

const SchemaMarkupGenerator = () => {
  const [schemaType, setSchemaType] = useState("Article");
  const [values, setValues] = useState(schemaDefaults.Article);
  const [copied, setCopied] = useState(false);

  const generatedSchema = useMemo(() => buildSchema(schemaType, values), [schemaType, values]);
  const generatedCode = useMemo(
    () => `<script type="application/ld+json">\n${JSON.stringify(generatedSchema, null, 2)}\n</script>`,
    [generatedSchema]
  );
  const missingFields = Object.entries(values)
    .filter(([, value]) => String(value).trim() === "")
    .map(([key]) => fieldLabels[key] || key);

  const handleTypeChange = (event) => {
    const nextType = event.target.value;
    setSchemaType(nextType);
    setValues(schemaDefaults[nextType]);
    setCopied(false);
  };

  const handleValueChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${schemaType.toLowerCase()}-schema.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setValues(schemaDefaults[schemaType]);
    setCopied(false);
  };

  return (
    <>
      <Helmet>
        <title>Schema Markup Generator | FreeToolsPro</title>
        <meta
          name="description"
          content="Generate valid JSON-LD schema markup for articles, FAQs, products, local businesses, and websites."
        />
        <link rel="canonical" href="https://freetoolspro.in/image-tools/schema-markup-generator" />
      </Helmet>

      <ToolHeroShell
        icon={FileJson}
        title="Schema Markup Generator"
        subtitle="Create clean JSON-LD schema markup for common SEO use cases and copy it straight into your page."
        category="image-tools"
        layout="stack"
        wide
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-700 bg-slate-900/80 p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Schema details</h2>
                <p className="text-sm text-slate-400">Choose a type and edit each field.</p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="schema-type">
              Schema type
            </label>
            <select
              id="schema-type"
              value={schemaType}
              onChange={handleTypeChange}
              className="mb-5 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25"
            >
              {Object.keys(schemaDefaults).map((type) => (
                <option key={type} value={type} className="bg-slate-900 text-white">
                  {type}
                </option>
              ))}
            </select>

            <div className="grid gap-4">
              {Object.entries(values).map(([key, value]) => {
                const isLongField = key.toLowerCase().includes("description") || key.toLowerCase().includes("answer");
                return (
                  <label key={key} className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">
                      {fieldLabels[key] || key}
                    </span>
                    {isLongField ? (
                      <textarea
                        value={value}
                        onChange={(event) => handleValueChange(key, event.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25"
                      />
                    ) : (
                      <input
                        value={value}
                        onChange={(event) => handleValueChange(key, event.target.value)}
                        type={key.toLowerCase().includes("date") ? "date" : "text"}
                        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/25"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-slate-700 bg-slate-900/80 p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Generated markup</h2>
                <p className="text-sm text-slate-400">
                  {missingFields.length ? `${missingFields.length} field(s) need attention.` : "All fields are filled."}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>

            {missingFields.length > 0 && (
              <div className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                Fill in: {missingFields.join(", ")}
              </div>
            )}

            <pre className="max-h-[620px] overflow-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-emerald-300">
              <code>{generatedCode}</code>
            </pre>
          </section>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/schema-markup-generator" />
    </>
  );
};

export default SchemaMarkupGenerator;
