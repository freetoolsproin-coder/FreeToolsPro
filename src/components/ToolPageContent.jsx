import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Link2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { tools } from "../data/toolDefinitions";
import { buildToolPageCopy } from "../data/buildToolPageCopy";
import RelatedTools from "./RelatedTools";
import RelatedBlogGuide from "./RelatedBlogGuide";
import WhatItDoesSection from "./WhatItDoesSection";
import GeoSummary from "./GeoSummary";
import FaqSchema from "./FaqSchema";
import HowToSchema from "./HowToSchema";

function FaqItem({ item, open, onToggle }) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="age-faq-item" data-open={open ? "true" : "false"}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{item.q}</span>
        <span className="age-faq-icon" aria-hidden="true">
          <span className="text-lg leading-none">+</span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-[0.95rem] leading-7 text-[var(--ftp-ink-soft)]">{item.a}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <>
      {eyebrow ? (
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--age-teal-deep,#0f766e)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="age-display mt-3 text-2xl font-semibold tracking-tight text-[var(--ftp-ink)] sm:text-3xl">
        {title}
      </h2>
    </>
  );
}

function ExamplePairBlock({ pair, index }) {
  return (
    <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4 sm:p-5">
      {pair.label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ftp-ink-soft)]">
          {pair.label}
        </p>
      ) : index > 0 ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ftp-ink-soft)]">
          Example {index + 1}
        </p>
      ) : null}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold text-[var(--ftp-ink)]">Example input</p>
          <pre className="mt-1.5 overflow-x-auto rounded-lg border border-[var(--ftp-line)] bg-white px-3 py-2.5 text-sm leading-6 text-[var(--ftp-ink-soft)] whitespace-pre-wrap">
            {pair.input}
          </pre>
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--ftp-ink)]">Example result</p>
          <pre className="mt-1.5 overflow-x-auto rounded-lg border border-teal-200/80 bg-teal-50/50 px-3 py-2.5 text-sm leading-6 text-[var(--ftp-ink)] whitespace-pre-wrap">
            {pair.result}
          </pre>
        </div>
      </div>
      {pair.note ? (
        <p className="mt-3 text-sm leading-6 text-[var(--ftp-ink-soft)]">{pair.note}</p>
      ) : null}
    </div>
  );
}

/**
 * Standard editorial column for every tool page:
 * what it does → how to use → example input/result → privacy → limitations → FAQ → related → last reviewed.
 */
export default function ToolPageContent({
  category,
  currentToolPath,
  toolName,
  toolDesc,
  relatedCategory,
  howTitle,
  howBody,
  steps,
  whatItDoes,
  faqs,
  trustBullets,
  ctaLabel = "Back to tool",
  exploreLabel = "More utilities from the FreeToolsPro suite.",
  examplePairs,
  privacyStatement,
  limitations,
  lastReviewed,
}) {
  const [openFaq, setOpenFaq] = useState(0);
  const catalogTool = tools.find((t) => t.path === currentToolPath);
  const currentTool =
    catalogTool ||
    (toolName
      ? { name: toolName, desc: toolDesc || "", path: currentToolPath, category: relatedCategory || category }
      : null);

  const copy = buildToolPageCopy({
    tool: currentTool,
    category: relatedCategory || category,
    currentToolPath,
    howTitle,
    howBody,
    steps,
    faqs,
    whatItDoes,
    examplePairs,
    privacyStatement,
    limitations,
    lastReviewed,
  });

  const resolvedTrust = trustBullets || copy.trustBullets || [
    "Runs locally when possible—inputs stay on device",
    "No signup wall between you and the answer",
    "Responsive, keyboard-friendly, clear contrast",
  ];

  const related = tools
    .filter(
      (t) =>
        !t.isPageLink &&
        t.path !== currentToolPath &&
        (relatedCategory || category ? t.category === (relatedCategory || category) : true)
    )
    .slice(0, 4);

  return (
    <section className="relative border-t border-[var(--age-line,var(--ftp-line))] bg-white/50">
      <FaqSchema faqs={copy.faqs} pageUrl={currentToolPath} />
      <HowToSchema
        name={currentTool?.name || "FreeToolsPro tool"}
        description={currentTool?.desc}
        url={currentToolPath}
        steps={copy.steps}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <article className="min-w-0 max-w-2xl" itemScope itemType="https://schema.org/WebApplication">
            <meta itemProp="name" content={currentTool?.name || "FreeToolsPro tool"} />
            <meta itemProp="url" content={`https://freetoolspro.in${currentToolPath || ""}`} />
            <meta itemProp="applicationCategory" content="UtilitiesApplication" />
            <meta itemProp="operatingSystem" content="Any" />
            <meta itemProp="isAccessibleForFree" content="true" />

            <GeoSummary
              path={currentToolPath}
              name={currentTool?.name}
              description={currentTool?.desc}
              whatItDoes={copy.whatItDoes}
            />

            {/* 1. What the tool does */}
            <SectionHeading eyebrow="Overview" title={copy.whatTitle} />
            <div className="mt-4 space-y-4 text-[1.02rem] leading-7 text-[var(--ftp-ink-soft)]">
              {copy.whatItDoesSummary.map((p) => (
                <p key={p.slice(0, 64)}>{p}</p>
              ))}
            </div>
            <WhatItDoesSection content={copy.whatItDoes} compact />

            {/* 2. How to use it */}
            <SectionHeading eyebrow="How to use" title={copy.howTitle} />
            <ol className="mt-6 space-y-5">
              {copy.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="age-display flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--ftp-ink)] text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--ftp-ink)]">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--ftp-ink-soft)]">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* 3. Example input and result */}
            <SectionHeading eyebrow="Examples" title="Example input and result" />
            <div className="mt-4 space-y-4">
              {copy.examplePairs.map((pair, index) => (
                <ExamplePairBlock key={`${pair.input.slice(0, 24)}-${index}`} pair={pair} index={index} />
              ))}
            </div>

            {/* 4. Privacy / data-processing statement */}
            <SectionHeading eyebrow="Privacy" title="Privacy and data processing" />
            <div className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-white px-4 py-4 sm:px-5">
              <div className="flex gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--age-teal-deep,#0f766e)]" aria-hidden="true" />
                <p className="text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">{copy.privacyStatement}</p>
              </div>
            </div>

            {/* 5. Limitations */}
            <SectionHeading eyebrow="Limitations" title="Limitations" />
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">
              {copy.limitations.map((item) => (
                <li key={item.slice(0, 64)}>{item}</li>
              ))}
            </ul>

            {/* 6. Frequently asked questions */}
            <div className="mt-12">
              <h2 className="age-display text-2xl font-semibold text-[var(--ftp-ink)]">
                Frequently asked questions
              </h2>
              <div className="mt-4">
                {copy.faqs.map((item, index) => (
                  <FaqItem
                    key={item.q}
                    item={item}
                    open={openFaq === index}
                    onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
                  />
                ))}
              </div>
            </div>

            {/* 7. Related tools */}
            <div className="mt-12">
              <h2 className="age-display text-2xl font-semibold text-[var(--ftp-ink)]">Related tools</h2>
              <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">{exploreLabel}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {related.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="group flex items-start gap-3 rounded-xl border border-[var(--age-line,var(--ftp-line))] bg-white/70 px-4 py-3.5 transition hover:border-teal-300/60 hover:bg-white"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--ftp-porcelain)] text-[var(--ftp-ink)] transition group-hover:bg-teal-50 group-hover:text-teal-800">
                        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[var(--ftp-ink)] group-hover:text-teal-900">
                          {tool.name}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-[var(--ftp-ink-soft)] line-clamp-2">
                          {tool.desc}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 8. Last reviewed / updated */}
            <p className="mt-12 border-t border-[var(--ftp-line)] pt-6 text-sm text-[var(--ftp-ink-soft)]">
              <time dateTime={copy.lastReviewed}>Last reviewed: {copy.lastReviewedLabel}</time>
            </p>
          </article>

          <aside className="space-y-6 self-start lg:sticky lg:top-24 lg:pt-2">
            <div className="rounded-[1.25rem] border border-[var(--age-line,var(--ftp-line))] bg-[var(--ftp-ink)] p-6 text-white">
              <Link2 className="h-5 w-5 text-[var(--age-teal,#2dd4bf)]" aria-hidden="true" />
              <p className="age-display mt-4 text-xl font-semibold leading-snug">
                Why teams trust FreeToolsPro
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/65">
                {resolvedTrust.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <button
                type="button"
                className="age-btn-primary mt-6 w-full bg-[var(--age-teal,#14b8a6)] text-[var(--ftp-ink)] hover:opacity-90"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <RelatedBlogGuide
              currentToolPath={currentToolPath}
              toolName={currentTool?.name}
            />
            <RelatedTools category={relatedCategory || category} currentToolPath={currentToolPath} />
          </aside>
        </div>
      </div>
    </section>
  );
}
