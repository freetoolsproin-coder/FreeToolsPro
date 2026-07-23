import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { tools } from "../data/toolDefinitions";
import { buildToolPageCopy } from "../data/buildToolPageCopy";
import RelatedTools from "./RelatedTools";
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

/**
 * Editorial column aligned with Google-preferred tool-page content:
 * what it does → why → how → examples → use cases → tips → FAQ → related.
 */
export default function ToolPageContent({
  category,
  currentToolPath,
  howTitle,
  howBody,
  steps,
  whatItDoes,
  faqs,
  trustBullets,
  ctaLabel = "Back to tool",
  exploreLabel = "More utilities from the FreeToolsPro suite.",
  privacyNote,
}) {
  const [openFaq, setOpenFaq] = useState(0);
  const currentTool = tools.find((t) => t.path === currentToolPath);

  const copy = buildToolPageCopy({
    tool: currentTool,
    category,
    currentToolPath,
    howTitle,
    howBody,
    steps,
    faqs,
    whatItDoes,
  });

  const resolvedTrust = trustBullets || copy.trustBullets || [
    "Runs locally when possible—inputs stay on device",
    "No signup wall between you and the answer",
    "Responsive, keyboard-friendly, clear contrast",
  ];
  const resolvedPrivacy = privacyNote || copy.privacyNote;

  const related = tools
    .filter(
      (t) => !t.isPageLink && t.path !== currentToolPath && (!category || t.category === category)
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

            {/* 2. Why someone would use it */}
            <SectionHeading eyebrow="Why use it" title="Why someone would use this tool" />
            <div className="mt-4 space-y-4 text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">
              {copy.whyUseful.map((p) => (
                <p key={p.slice(0, 64)}>{p}</p>
              ))}
            </div>
            {copy.benefits?.length ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">
                {copy.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}

            {/* 3. How to use it */}
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

            {/* 4. Practical examples */}
            <SectionHeading eyebrow="Examples" title="Practical examples" />
            <div className="mt-4 space-y-4 text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">
              {copy.examples.map((p) => (
                <p key={p.slice(0, 64)}>{p}</p>
              ))}
            </div>

            {/* 5. Common use cases */}
            <SectionHeading eyebrow="Use cases" title="Common use cases" />
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">
              {copy.useCases.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>

            {/* 6. Tips and best practices */}
            <SectionHeading eyebrow="Tips" title="Tips and best practices" />
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]">
              {copy.tips.map((tip) => (
                <li key={tip.slice(0, 64)}>{tip}</li>
              ))}
            </ul>

            {resolvedPrivacy ? (
              <aside className="mt-8 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--age-teal-deep,#0f766e)]">
                  Limitations &amp; privacy
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--ftp-ink-soft)]">{resolvedPrivacy}</p>
              </aside>
            ) : null}

            {/* 7. FAQs */}
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

            {/* 8. Related tools */}
            <div className="mt-12">
              <h2 className="age-display text-2xl font-semibold text-[var(--ftp-ink)]">
                Related tools
              </h2>
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
            <RelatedTools category={category} currentToolPath={currentToolPath} />
          </aside>
        </div>
      </div>
    </section>
  );
}
