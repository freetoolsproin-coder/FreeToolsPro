import { useEffect, useMemo, useState } from "react";
import { explainConcept, feynmanCheck, analyse, saveNotes } from "../../../tools/study.js";
import { CopyButton } from "../ui.jsx";
import { useNotes, NotesInput, Seg, SendTo } from "./common.jsx";

const SECTIONS = [
  ["definition", "What it is"],
  ["process", "How it works"],
  ["cause", "Causes and effects"],
  ["importance", "Why it matters"],
  ["example", "Examples"],
  ["contrast", "Compare and contrast"],
  ["other", "More from your notes"],
];

/** Look a concept up on Wikipedia (English or Simple English). Only the concept name is sent. */
async function wikiLookup(concept, lang) {
  const host = `https://${lang}.wikipedia.org/w/api.php`;
  const s = await fetch(`${host}?action=query&list=search&srsearch=${encodeURIComponent(concept)}&srlimit=1&format=json&origin=*`).then((r) => r.json());
  const hit = s?.query?.search?.[0];
  if (!hit) throw new Error(`No ${lang === "simple" ? "Simple English " : ""}Wikipedia article found for “${concept}”.`);
  const x = await fetch(`${host}?action=query&prop=extracts&explaintext=1&exsectionformat=plain&redirects=1&titles=${encodeURIComponent(hit.title)}&format=json&origin=*`).then((r) => r.json());
  const page = Object.values(x?.query?.pages || {})[0];
  let text = (page?.extract || "").split(/\n(?:See also|References|External links|Further reading|Notes|Gallery)\n/)[0];
  text = text.slice(0, 14000);
  if (!text.trim()) throw new Error("That article has no readable text.");
  return { title: page.title, text, url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}` };
}

export default function ConceptExplainer() {
  const N = useNotes();
  const [concept, setConcept] = useState("photosynthesis");
  const [source, setSource] = useState("notes");
  const [level, setLevel] = useState("standard");
  const [wiki, setWiki] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [own, setOwn] = useState("");

  useEffect(() => {
    const c = new URLSearchParams(location.search).get("c");
    if (c) setConcept(c.slice(0, 80));
  }, []);

  const lookup = async (c = concept, src = source) => {
    if (src === "notes" || !c.trim()) return;
    setBusy(true);
    setErr("");
    try {
      setWiki(await wikiLookup(c.trim(), src === "simple" ? "simple" : "en"));
    } catch (e) {
      setWiki(null);
      setErr(e.message === "Failed to fetch" ? "Could not reach Wikipedia. Check your connection, or explain from your own notes." : e.message);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (source !== "notes") lookup(concept, source);
  }, [source]);

  const text = source === "notes" ? N.notes : wiki?.text || "";
  const ex = useMemo(() => {
    if (!text.trim() || !concept.trim()) return null;
    const r = explainConcept(text, concept, { level });
    // The article title may be spelt differently from what was typed ("Ohms law" → "Ohm's law").
    if (!r.found && wiki && source !== "notes") return explainConcept(text, wiki.title.replace(/\s*\(.*\)$/, ""), { level });
    return r;
  }, [text, concept, level, wiki, source]);
  const suggestions = useMemo(() => (source === "notes" ? analyse(N.notes).terms.filter((t) => t.noun).slice(0, 10).map((t) => t.label) : []), [N.notes, source]);
  const check = useMemo(() => (own.trim() && text.trim() ? feynmanCheck(own, text, concept) : null), [own, text, concept]);

  const pick = (c) => {
    setConcept(c);
    setOwn("");
    if (source !== "notes") lookup(c, source);
  };
  const asText = () => {
    if (!ex?.found) return "";
    const lines = [`${concept.toUpperCase()}`, "", ex.oneLine, ""];
    for (const [k, h] of SECTIONS) if (ex.sections[k].length) lines.push(h, ...ex.sections[k].map((s) => `- ${s}`), "");
    if (ex.related.length) lines.push(`Related: ${ex.related.join(", ")}`, "");
    lines.push("Check yourself:", ...ex.questions.map((q) => `- ${q}`));
    if (wiki && source !== "notes") lines.push("", `Source: Wikipedia, “${wiki.title}” (CC BY-SA 4.0) ${wiki.url}`);
    return lines.join("\n");
  };
  const toCards = () => {
    saveNotes(asText());
    location.href = "/ai-study-tools/flashcard-generator?notes=1";
  };

  return (
    <div className="study">
      <div className="explain-top panel">
        <div className="field explain-top__q">
          <label className="field__label" htmlFor="cx-c">
            Concept to explain
          </label>
          <div className="line-in">
            <input id="cx-c" className="input input--lg" value={concept} onChange={(e) => setConcept(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()} placeholder="e.g. photosynthesis, inflation, Ohm's law" />
            {source !== "notes" && (
              <button type="button" className="btn btn--primary" onClick={() => lookup()} disabled={busy || !concept.trim()}>
                {busy ? "Looking up…" : "Explain"}
              </button>
            )}
          </div>
        </div>
        <Seg label="Explain from" value={source} onChange={setSource} options={[["notes", "My notes"], ["simple", "Simple Wikipedia"], ["en", "Wikipedia"]]} />
        <Seg label="Reading level" value={level} onChange={setLevel} options={[["standard", "Standard"], ["simple", "Simpler words"]]} />
      </div>

      <div className="io io--split">
        <div className="io__pane">
          {source === "notes" ? (
            <>
              <NotesInput id="cx" {...N} rows={11} />
              {suggestions.length > 0 && (
                <div>
                  <p className="field__label">Concepts in your notes</p>
                  <ul className="chips">
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button type="button" className={`chip chip--btn ${s.toLowerCase() === concept.toLowerCase() ? "is-on" : ""}`} onClick={() => pick(s)}>
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="study-out">
              <p className="field__hint">Only the concept name is sent to Wikipedia. The explanation is then built on your device from the article text.</p>
              {err && <p className="study-error">{err}</p>}
              {wiki && (
                <p className="wiki-src">
                  Source: <a href={wiki.url} target="_blank" rel="noopener">{wiki.title}</a> on {source === "simple" ? "Simple English " : ""}Wikipedia, licensed CC BY-SA 4.0.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="io__pane">
          {!ex ? (
            <p className="study-empty">{busy ? "Looking it up…" : source === "notes" ? "Type a concept and paste notes that mention it." : "Press Explain to look the concept up."}</p>
          ) : ex.error ? (
            <p className="study-empty">{ex.error}</p>
          ) : !ex.found ? (
            <div className="study-out">
              <p className="study-empty">“{concept}” is not mentioned in {source === "notes" ? "your notes" : "this article"}.</p>
              {ex.concepts.length > 0 && (
                <>
                  <p className="field__label">Try one of these instead</p>
                  <ul className="chips">
                    {ex.concepts.map((c) => (
                      <li key={c}>
                        <button type="button" className="chip chip--btn" onClick={() => pick(c)}>
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {source === "notes" && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSource("simple")}>
                  Look it up on Simple Wikipedia instead
                </button>
              )}
            </div>
          ) : (
            <div className="study-out explain">
              <p className="tldr">
                <span className="tldr__tag">In one line</span>
                {ex.oneLine}
              </p>
              {SECTIONS.map(([k, h]) =>
                ex.sections[k].length ? (
                  <section key={k} className={`xsec xsec--${k}`}>
                    <h3 className="sumsec__h">{h}</h3>
                    <ul>
                      {ex.sections[k].slice(0, k === "other" ? 4 : 6).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </section>
                ) : null
              )}
              {ex.related.length > 0 && (
                <section className="xsec">
                  <h3 className="sumsec__h">Connected ideas</h3>
                  <ul className="chips">
                    {ex.related.map((r) => (
                      <li key={r}>
                        <button type="button" className="chip chip--btn" onClick={() => pick(r)}>
                          {r} →
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section className="xsec xsec--q">
                <h3 className="sumsec__h">Check yourself</h3>
                <ol>
                  {ex.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              </section>
              <div className="row-actions">
                <CopyButton text={asText} label="Copy explanation" />
                <button type="button" className="btn btn--ghost btn--sm" onClick={toCards}>
                  Make flashcards from this →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {ex?.found && (
        <div className="feynman panel">
          <h3 className="sumsec__h">Feynman check: explain it in your own words</h3>
          <p className="field__hint">Write the explanation you would give a friend, without looking. The checker compares it with the key ideas and tells you what you left out.</p>
          <textarea className="input textarea textarea--sm" rows={4} value={own} onChange={(e) => setOwn(e.target.value)} placeholder={`${concept} is…`} aria-label="Your explanation" />
          {check && (
            <div className="feynman__out">
              <div className="smeter" role="img" aria-label={`Covers ${Math.round(check.coverage)}% of key ideas`}>
                <span style={{ width: `${check.coverage}%` }} />
              </div>
              <p>
                <b>{Math.round(check.coverage)}%</b> of the key ideas covered · {check.words} words
              </p>
              {check.covered.length > 0 && (
                <p>
                  <span className="field__label">You mentioned</span>
                  <span className="chips chips--inline">
                    {check.covered.map((c) => (
                      <span key={c} className="chip chip--ok">
                        ✓ {c}
                      </span>
                    ))}
                  </span>
                </p>
              )}
              {check.missing.length > 0 && (
                <p>
                  <span className="field__label">Try to include</span>
                  <span className="chips chips--inline">
                    {check.missing.map((c) => (
                      <span key={c} className="chip chip--miss">
                        {c}
                      </span>
                    ))}
                  </span>
                </p>
              )}
              {check.tips.length > 0 && (
                <ul className="feynman__tips">
                  {check.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
      {source === "notes" && <SendTo text={N.notes} current="concept-explainer" />}
    </div>
  );
}
