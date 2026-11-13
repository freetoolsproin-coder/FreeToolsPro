// Shared pieces for the AI Study islands: notes input (paste, .txt/.md/.pdf, sample),
// segmented controls, and the "send these notes to another study tool" bar.
import { useEffect, useRef, useState } from "react";
import { SAMPLE_NOTES, saveNotes, loadNotes, countWords } from "../../../tools/study.js";

export const STUDY_TOOLS = [
  ["notes-summarizer", "/ai-study-tools/notes-summarizer", "Summarize"],
  ["flashcard-generator", "/ai-study-tools/flashcard-generator", "Make flashcards"],
  ["quiz-generator", "/ai-study-tools/quiz-generator", "Make a quiz"],
  ["concept-explainer", "/ai-study-tools/concept-explainer", "Explain a concept"],
];

export function safeGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}
export function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Notes state shared across the study tools: starts with the sample, picks up notes sent from another tool. */
export function useNotes() {
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [origin, setOrigin] = useState("sample");
  const [saved, setSaved] = useState(null);
  useEffect(() => {
    const s = loadNotes();
    const q = new URLSearchParams(location.search);
    if (s && s.text.trim() && s.text !== SAMPLE_NOTES) {
      if (q.get("notes") === "1") {
        setNotes(s.text);
        setOrigin("sent");
        history.replaceState(null, "", location.pathname + location.hash);
      } else setSaved(s);
    }
  }, []);
  useEffect(() => {
    if (origin === "sample" && notes === SAMPLE_NOTES) return;
    const t = setTimeout(() => saveNotes(notes), 500);
    return () => clearTimeout(t);
  }, [notes, origin]);
  const update = (v) => {
    setNotes(v);
    setOrigin("typed");
  };
  const useSaved = () => {
    if (saved) {
      setNotes(saved.text);
      setOrigin("saved");
      setSaved(null);
    }
  };
  return { notes, setNotes: update, origin, saved, useSaved };
}

async function pdfText(file) {
  const [pdfjs, worker] = await Promise.all([import("pdfjs-dist/legacy/build/pdf.mjs"), import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url")]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const parts = [];
  for (let i = 1; i <= Math.min(pdf.numPages, 60); i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    let t = "";
    for (const item of tc.items) {
      if (typeof item.str !== "string") continue;
      t += item.str;
      if (item.hasEOL) t += "\n";
    }
    parts.push(t);
    page.cleanup();
  }
  const text = parts
    .join("\n\n")
    .replace(/(\p{L})-\n(?=\p{Ll})/gu, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!text) throw new Error("No text found in this PDF. It may be a scan, which needs OCR first.");
  return text;
}

/** Notes textarea with Open file, Sample and Clear. */
export function NotesInput({ id, notes, setNotes, saved, useSaved, origin, rows = 12, label = "Your notes", hint }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const open = async (e) => {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setErr("");
    try {
      if (/\.pdf$/i.test(f.name) || f.type === "application/pdf") {
        setBusy("Reading PDF…");
        setNotes(await pdfText(f));
      } else setNotes(await f.text());
    } catch (x) {
      setErr(x.message || "Could not read that file.");
    } finally {
      setBusy("");
    }
  };
  const words = countWords(notes);
  return (
    <div className="io__pane">
      <div className="io__bar">
        <label className="field__label" htmlFor={`${id}-notes`}>
          {label}
          <span className="field__count is-under">{new Intl.NumberFormat("en-IN").format(words)} words</span>
        </label>
        <div className="io__tools">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fileRef.current.click()} disabled={!!busy}>
            {busy || "Open file"}
          </button>
          <input ref={fileRef} type="file" className="visually-hidden" accept=".txt,.md,.markdown,.csv,.pdf,text/*,application/pdf" onChange={open} />
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setNotes(SAMPLE_NOTES)}>
            Sample
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setNotes("")} disabled={!notes}>
            Clear
          </button>
        </div>
      </div>
      {saved && (
        <p className="study-banner">
          You have notes from your last session ({countWords(saved.text)} words).{" "}
          <button type="button" className="linkbtn" onClick={useSaved}>
            Use them
          </button>
        </p>
      )}
      {origin === "sent" && <p className="study-banner">Using the notes you sent from another study tool.</p>}
      <textarea id={`${id}-notes`} className="input textarea textarea--notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={rows} spellCheck="true" placeholder="Paste your class notes, a textbook section or an article. Headings, bullet points and 'Term: meaning' lines all help." />
      {hint && <p className="field__hint">{hint}</p>}
      {err && <p className="study-error" role="alert">{err}</p>}
    </div>
  );
}

/** Segmented control. options: [[value, label], …] */
export function Seg({ label, value, onChange, options, name }) {
  return (
    <div className="field">
      {label && <span className="field__label">{label}</span>}
      <div className="seg" role="radiogroup" aria-label={label || name}>
        {options.map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={value === v} className="seg__opt" onClick={() => onChange(v)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Tabs({ value, onChange, tabs, label = "Views" }) {
  return (
    <div className="seg seg--wrap study-tabs" role="tablist" aria-label={label}>
      {tabs.map(([v, l, n]) => (
        <button key={v} type="button" role="tab" aria-selected={value === v} className="seg__opt" onClick={() => onChange(v)}>
          {l}
          {n !== undefined && <span className="study-tabs__n">{n}</span>}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__track" aria-hidden="true"></span>
      {label}
    </label>
  );
}

export function NumberBox({ id, label, value, onChange, min = 1, max = 100, step = 1, unit }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="study-num">
        <input id={id} className="input" type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
        {unit && <span className="study-num__unit">{unit}</span>}
      </div>
    </div>
  );
}

/** Buttons that hand the current notes to another study tool. */
export function SendTo({ text, current }) {
  const go = (path) => {
    saveNotes(text);
    location.href = `${path}?notes=1`;
  };
  return (
    <div className="sendto" aria-label="Use these notes in another study tool">
      <span className="sendto__label">Use these notes to:</span>
      {STUDY_TOOLS.filter(([id]) => id !== current).map(([id, path, label]) => (
        <button key={id} type="button" className="btn btn--ghost btn--sm" onClick={() => go(path)}>
          {label} →
        </button>
      ))}
    </div>
  );
}

/** Open a print window with the given HTML body (for worksheets, Cornell notes and plans). */
export function printHtml(title, body) {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
  body{font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#111;margin:28px;}
  h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:22px 0 8px}p.muted{color:#555;margin:0 0 16px;font-size:13px}
  table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:8px 10px;vertical-align:top;text-align:left}
  th{background:#f2f2f2}ol li{margin:0 0 12px}.opts{list-style:upper-alpha;margin:6px 0 0}.ans{border-top:2px dashed #999;margin-top:28px;padding-top:12px}
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:0}.cards div{border:1px dashed #999;padding:18px;min-height:110px;break-inside:avoid}
  .cards .b{background:#fafafa}.day{break-inside:avoid;margin:0 0 10px}.box{display:inline-block;width:12px;height:12px;border:1.5px solid #333;margin-right:6px;vertical-align:-1px}
  footer{margin-top:28px;color:#777;font-size:12px}@media print{body{margin:12mm}}
  </style></head><body>${body}<footer>Made with FreeToolsPro AI Study tools · freetoolspro.in</footer><script>setTimeout(()=>print(),300)<\/script></body></html>`);
  w.document.close();
}
export function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Compact share links: JSON → deflate → base64url in the URL hash (falls back to plain base64url). */
export async function packHash(obj) {
  const json = new TextEncoder().encode(JSON.stringify(obj));
  let bytes = json,
    tag = "j";
  if (typeof CompressionStream !== "undefined") {
    const cs = new Blob([json]).stream().pipeThrough(new CompressionStream("deflate-raw"));
    bytes = new Uint8Array(await new Response(cs).arrayBuffer());
    tag = "z";
  }
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return tag + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export async function unpackHash(s) {
  const tag = s[0];
  const b64 = s.slice(1).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  let bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  if (tag === "z") {
    const ds = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    bytes = new Uint8Array(await new Response(ds).arrayBuffer());
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
