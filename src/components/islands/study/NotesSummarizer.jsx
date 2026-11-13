import { useMemo, useState } from "react";
import { summarize } from "../../../tools/study.js";
import { CopyButton, DownloadButton } from "../ui.jsx";
import { useNotes, NotesInput, Seg, Tabs, SendTo, printHtml, esc } from "./common.jsx";

function toMarkdown(r) {
  const out = ["# Summary", "", `**In short:** ${r.tldr}`, "", "## Key points"];
  let sec = null;
  for (const p of r.points) {
    if (p.section && p.section !== sec) {
      out.push("", `### ${p.section}`);
      sec = p.section;
    }
    out.push(`- ${p.text}`);
  }
  if (r.glossary.length) {
    out.push("", "## Key terms");
    for (const g of r.glossary) out.push(`- **${g.term}**: ${g.def}`);
  }
  out.push("", "## Revise these", ...r.cornell.map((c) => `- ${c.cue}`));
  return out.join("\n");
}

function grouped(points) {
  const g = [];
  for (const p of points) {
    const last = g[g.length - 1];
    if (last && last.section === p.section) last.items.push(p);
    else g.push({ section: p.section, items: [p] });
  }
  return g;
}

/** Wrap key terms in <mark> for the highlighted view. */
function TermText({ text, terms }) {
  if (!terms.length) return text;
  const labels = [...new Set(terms.map((t) => t.label))].sort((a, b) => b.length - a.length);
  const re = new RegExp(`\\b(${labels.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[\\s-]+")).join("|")})\\w*`, "gi");
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    parts.push(text.slice(last, m.index));
    parts.push(<strong key={m.index} className="term-hl">{m[0]}</strong>);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

export default function NotesSummarizer() {
  const N = useNotes();
  const [level, setLevel] = useState("standard");
  const [view, setView] = useState("summary");
  const r = useMemo(() => summarize(N.notes, { level }), [N.notes, level]);
  const pct = r.error ? 0 : Math.max(0, Math.round((1 - r.stats.after / Math.max(1, r.stats.before)) * 100));
  const mins = (m) => (m < 1 ? "under 1 min" : `${Math.round(m)} min`);

  const print = () => {
    const rows = r.cornell.map((c) => `<tr><td style="width:32%"><b>${esc(c.cue)}</b></td><td>${esc(c.note)}</td></tr>`).join("");
    printHtml(
      "Cornell notes",
      `<h1>Cornell notes</h1><p class="muted">${r.stats.before} words summarized to ${r.stats.after}</p><table><tr><th>Cues / questions</th><th>Notes</th></tr>${rows}</table><h2>Summary</h2><p>${esc(r.tldr)}</p>${
        r.glossary.length ? `<h2>Key terms</h2><ul>${r.glossary.map((g) => `<li><b>${esc(g.term)}</b>: ${esc(g.def)}</li>`).join("")}</ul>` : ""
      }`
    );
  };

  return (
    <div className="study">
      <div className="io io--split">
        <NotesInput id="sum" {...N} hint="Works best with a few paragraphs or a page of notes. PDFs are read on your device." />
        <div className="io__pane">
          <div className="study-opts">
            <Seg label="Summary length" value={level} onChange={setLevel} options={[["brief", "Brief"], ["standard", "Standard"], ["detailed", "Detailed"]]} />
          </div>
          {r.error ? (
            <p className="study-empty">{r.error}</p>
          ) : (
            <>
              <dl className="stats">
                <div className="stats__item">
                  <dt>Shorter by</dt>
                  <dd>{pct}%</dd>
                </div>
                <div className="stats__item">
                  <dt>Reading time</dt>
                  <dd>
                    {mins(r.stats.readBefore)} → {mins(r.stats.readAfter)}
                  </dd>
                </div>
                <div className="stats__item">
                  <dt>Definitions found</dt>
                  <dd>{r.glossary.length}</dd>
                </div>
              </dl>
              <Tabs
                value={view}
                onChange={setView}
                tabs={[
                  ["summary", "Summary"],
                  ["cornell", "Cornell notes"],
                  ["glossary", "Key terms", r.glossary.length || undefined],
                  ["highlight", "Highlighted notes"],
                ]}
              />
              <div className="study-out" role="tabpanel">
                {view === "summary" && (
                  <>
                    <p className="tldr">
                      <span className="tldr__tag">In short</span>
                      {r.tldr}
                    </p>
                    {grouped(r.points).map((g, k) => (
                      <section key={k} className="sumsec">
                        {g.section && <h3 className="sumsec__h">{g.section}</h3>}
                        <ul>
                          {g.items.map((p) => (
                            <li key={p.i}>
                              <TermText text={p.text} terms={r.terms.slice(0, 8)} />
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </>
                )}
                {view === "cornell" && (
                  <div className="cornell">
                    <div className="cornell__grid">
                      <div className="cornell__h">Cue / question</div>
                      <div className="cornell__h">Notes</div>
                      {r.cornell.map((c, k) => (
                        <div className="cornell__row" key={k}>
                          <div className="cornell__cue">{c.cue}</div>
                          <div className="cornell__note">{c.note}</div>
                        </div>
                      ))}
                    </div>
                    <div className="cornell__sum">
                      <strong>Summary:</strong> {r.tldr}
                    </div>
                    <p className="field__hint">Cover the right column and answer each cue from memory. That is active recall, the fastest way to make notes stick.</p>
                  </div>
                )}
                {view === "glossary" && (
                  <>
                    {r.glossary.length ? (
                      <dl className="glossary">
                        {r.glossary.map((g) => (
                          <div key={g.term}>
                            <dt>{g.term}</dt>
                            <dd>{g.def}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="study-empty">No definitions found. Lines like “Osmosis: movement of water across a membrane” or sentences like “Osmosis is the…” are picked up.</p>
                    )}
                    <p className="field__label">Most important words</p>
                    <ul className="chips">
                      {r.terms.map((t) => (
                        <li key={t.key} className="chip">
                          {t.label} <span>{t.count}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {view === "highlight" && (
                  <div className="hlnotes">
                    {r.sents.map((s) => (
                      <span key={s.i} className={r.highlights.has(s.i) ? "hlnotes__s is-key" : "hlnotes__s"}>
                        {s.text}{" "}
                      </span>
                    ))}
                    <p className="field__hint">Highlighted sentences made it into the summary. Everything else is supporting detail.</p>
                  </div>
                )}
              </div>
              <div className="row-actions">
                <CopyButton text={() => toMarkdown(r)} label="Copy summary" />
                <DownloadButton text={() => toMarkdown(r)} name="summary.md" mime="text/markdown" label="Download .md" />
                <button type="button" className="btn btn--ghost btn--sm" onClick={print}>
                  Print Cornell notes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <SendTo text={N.notes} current="notes-summarizer" />
    </div>
  );
}
