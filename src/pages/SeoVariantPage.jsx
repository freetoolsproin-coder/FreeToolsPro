import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Sparkles } from "lucide-react";
import ToolHeroShell from "../components/ToolHeroShell";
import ToolContentLayout from "../components/ToolContentLayout";
import {
  getSeoVariant,
  relatedVariants,
} from "../data/seoVariants";
import { BRAND, absoluteUrl } from "../seo/brand";
import { tools } from "../data/toolDefinitions";

const NotFoundPage = lazy(() => import("./NotFoundPage"));

/**
 * Programmatic SEO landing for a tool variation.
 * Renders unique meta + copy, then CTAs into the parent tool with presets.
 */
export default function SeoVariantPage({ parentPath }) {
  const { variant: slug } = useParams();
  const variant = getSeoVariant(parentPath, slug);

  if (!variant) {
    return (
      <Suspense fallback={null}>
        <NotFoundPage />
      </Suspense>
    );
  }

  const related = relatedVariants(variant, 8);
  const canonical = absoluteUrl(variant.path);
  const keywords = variant.keywords.join(", ");
  const parentTool = tools.find((t) => t.path === variant.parentPath);

  const steps =
    variant.steps?.map((step, index) =>
      typeof step === "string"
        ? { title: `Step ${index + 1}`, body: step }
        : step
    ) || [];

  const faqSchema =
    variant.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: variant.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <Helmet>
        <title>{variant.title}</title>
        <meta name="description" content={variant.description} />
        {keywords ? <meta name="keywords" content={keywords} /> : null}
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={variant.title} />
        <meta property="og:description" content={variant.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={BRAND.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={variant.title} />
        <meta name="twitter:description" content={variant.description} />
        {faqSchema ? (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        ) : null}
      </Helmet>

      <ToolHeroShell
        category={variant.category}
        icon={Sparkles}
        title={variant.h1}
        subtitle={variant.description}
        formLabel="Quick start"
        formHint="Jump into the free tool with this preset"
        layout="stack"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to={variant.toolUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            {variant.ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to={variant.parentPath}
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[var(--ftp-ink)] transition hover:border-teal-500/40"
          >
            All {variant.parentName} options
          </Link>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category={variant.category}
        relatedCategory={parentTool?.category || variant.category}
        currentToolPath={variant.path}
        toolName={variant.h1}
        toolDesc={variant.description}
        howBody={variant.intro}
        steps={steps}
        faqs={variant.faqs}
        examplePairs={
          variant.examplePairs ||
          (variant.presets && Object.keys(variant.presets).length
            ? [
                {
                  input: Object.entries(variant.presets)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join("\n"),
                  result: `Open ${variant.parentName} with this preset to see the live conversion or calculation.`,
                },
              ]
            : undefined)
        }
        exploreLabel={`More ${variant.parentName} variations and related utilities.`}
        ctaLabel={variant.ctaLabel}
      />

      {related.length > 0 ? (
        <div className="mx-auto max-w-3xl border-t border-[var(--ftp-line)] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-[var(--ftp-ink)]">Related conversions</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.path}>
                <Link
                  to={r.path}
                  className="block rounded-lg border border-black/8 bg-white px-3 py-2.5 text-sm text-teal-800 transition hover:border-teal-400/50"
                >
                  {r.h1}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
