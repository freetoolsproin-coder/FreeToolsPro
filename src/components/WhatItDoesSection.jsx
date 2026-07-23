import { Link } from "react-router-dom";

/**
 * Long-form "What the tool does" editorial block (human-first GEO explanations).
 * @typedef {{ paragraphs?: string[], sections?: { title: string, paragraphs: string[] }[] }} WhatItDoesContent
 */

function linkBrandMentions(text) {
  if (!text || !text.includes("FreeToolsPro")) return text;
  const parts = text.split(/(FreeToolsPro)/g);
  return parts.map((part, i) =>
    part === "FreeToolsPro" ? (
      <Link
        key={`${part}-${i}`}
        to="/about"
        className="font-medium text-[var(--ftp-ink)] underline decoration-[rgba(13,148,136,0.4)] underline-offset-2 hover:text-[var(--ftp-teal,#0d9488)]"
      >
        FreeToolsPro
      </Link>
    ) : (
      <span key={`${i}-${part.slice(0, 12)}`}>{part}</span>
    )
  );
}

export default function WhatItDoesSection({ content, compact = false }) {
  if (!content) return null;

  const { paragraphs = [], sections = [] } = content;
  const hasBody = paragraphs.length > 0 || sections.length > 0;
  if (!hasBody) return null;

  // When compact, skip repeating lead paragraphs already shown in the summary above.
  const bodyParagraphs = compact ? [] : paragraphs;
  const hasExtra = bodyParagraphs.length > 0 || sections.length > 0;
  if (!hasExtra) return null;

  return (
    <div className={compact ? "mt-6" : "mt-12"} data-geo="tool-explanation">
      {!compact ? (
        <h2 className="age-display text-2xl font-semibold text-[var(--ftp-ink)]">
          What the tool does
        </h2>
      ) : sections.length > 0 ? (
        <h3 className="mt-2 text-base font-semibold text-[var(--ftp-ink)]">
          More detail
        </h3>
      ) : null}
      <div className={`${compact ? "mt-3" : "mt-4"} space-y-4 text-[0.98rem] leading-7 text-[var(--ftp-ink-soft)]`}>
        {bodyParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{linkBrandMentions(paragraph)}</p>
        ))}
        {sections.map((section) => (
          <div key={section.title} className="pt-2">
            <h3 className="text-base font-semibold text-[var(--ftp-ink)]">{section.title}</h3>
            <div className="mt-2 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{linkBrandMentions(paragraph)}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
