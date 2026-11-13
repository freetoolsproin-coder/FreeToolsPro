// Shared pieces for the LaTeX islands. The TeX engine is a large file, so it is loaded after the page is up.
import { useEffect, useMemo, useRef, useState } from "react";

let enginePromise = null;
export function loadEngine() {
  enginePromise ??= import("../../../tools/latex/engine.js");
  return enginePromise;
}

/** The TeX engine, or null until it has loaded. */
export function useEngine() {
  const [engine, setEngine] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    loadEngine().then(
      (m) => live && setEngine(m),
      () => {
        enginePromise = null;
        if (live) setFailed(true);
      },
    );
    return () => {
      live = false;
    };
  }, []);
  return failed ? { failed } : engine;
}

/** One rendered formula. Shows the source as text until the engine is ready. */
export function Tex({ engine, tex, display = true, className = "", label }) {
  const r = useMemo(() => (engine?.texToSvg ? engine.texToSvg(tex, { display }) : null), [engine, tex, display]);
  if (!r || r.error) return <code className={`ltx-src ${className}`}>{tex}</code>;
  return <span className={`ltx-math ${className}`} role="img" aria-label={label || tex} dangerouslySetInnerHTML={{ __html: r.svg }} />;
}

/** Large preview panel with the error underneath when the LaTeX cannot be read. */
export function Preview({ engine, tex, display = true, style, empty = "Your equation will appear here." }) {
  const r = useMemo(() => (engine?.texToSvg ? engine.texToSvg(tex, { display }) : null), [engine, tex, display]);
  const last = useRef("");
  if (r?.svg) last.current = r.svg;
  if (engine?.failed)
    return (
      <p className="msg msg--error" role="alert">
        The equation engine could not load. Check your connection and refresh the page.
      </p>
    );
  return (
    <div className="ltx-preview-wrap">
      <div className={`ltx-preview ${r?.error ? "is-stale" : ""}`} style={style} aria-live="polite">
        {!r ? <span className="muted">Loading the equation engine…</span> : !tex.trim() ? <span className="muted">{empty}</span> : <span className="ltx-math" role="img" aria-label={tex} dangerouslySetInnerHTML={{ __html: r.svg || last.current }} />}
      </div>
      {r?.error && (
        <p className="msg msg--error" role="alert">
          {r.error}
        </p>
      )}
    </div>
  );
}

export function Seg({ label, value, onChange, options }) {
  return (
    <div className="field">
      {label && <span className="field__label">{label}</span>}
      <div className="seg" role="radiogroup" aria-label={label}>
        {options.map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={value === v} className="seg__opt" onClick={() => onChange(v)}>
            {l}
          </button>
        ))}
      </div>
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

export function Num({ id, label, value, onChange, min = 1, max = 20, step = 1, unit }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="ltx-num">
        <input
          id={id}
          className="input"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          onBlur={() => {
            const n = Number(value);
            onChange(Number.isFinite(n) && value !== "" ? Math.min(max, Math.max(min, n)) : min);
          }}
        />
        {unit && <span className="muted">{unit}</span>}
      </div>
    </div>
  );
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Number(v) || lo));
export { clamp };

/** Insert text at the caret of a textarea held in `ref`; `|` in the snippet marks where the caret lands. */
export function insertAt(ref, value, setValue, snippet) {
  const el = ref.current;
  const caret = snippet.indexOf("|");
  const text = snippet.replace("|", "");
  const start = el ? el.selectionStart : value.length;
  const end = el ? el.selectionEnd : value.length;
  const next = value.slice(0, start) + text + value.slice(end);
  setValue(next);
  requestAnimationFrame(() => {
    if (!el) return;
    el.focus();
    const p = start + (caret < 0 ? text.length : caret);
    el.setSelectionRange(p, p);
  });
}

// Hand a document from one LaTeX tool to another in this tab.
const SEND_KEY = "ftp-latex-send";
export function sendTo(path, tex) {
  try {
    sessionStorage.setItem(SEND_KEY, tex);
    location.href = `${path}?from=tool`;
  } catch {
    location.href = path;
  }
}
export function receive() {
  try {
    if (new URLSearchParams(location.search).get("from") !== "tool") return null;
    const t = sessionStorage.getItem(SEND_KEY);
    sessionStorage.removeItem(SEND_KEY);
    history.replaceState(null, "", location.pathname);
    return t;
  } catch {
    return null;
  }
}

/** Picture of an equation. Returns a Blob. */
export async function svgToPng(svg, { fontPx = 32, scale = 2, color = "#000000", background = null, padding = 12 }) {
  const { w, h, body } = sizeSvg(svg, fontPx, padding, color, background);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(w * scale);
  canvas.height = Math.ceil(h * scale);
  const img = new Image();
  const url = URL.createObjectURL(new Blob([body], { type: "image/svg+xml" }));
  try {
    await new Promise((ok, no) => {
      img.onload = ok;
      img.onerror = () => no(new Error("Could not draw this equation."));
      img.src = url;
    });
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
  return new Promise((ok) => canvas.toBlob(ok, "image/png"));
}

/** A self-contained SVG file: fixed size, solid colour, optional background and padding. */
export function sizeSvg(svg, fontPx, padding, color, background) {
  const [, x, y, vw, vh] = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/);
  const k = fontPx / 1000;
  const w = vw * k + 2 * padding;
  const h = vh * k + 2 * padding;
  const pad = padding / k;
  const box = `${x - pad} ${y - pad} ${Number(vw) + 2 * pad} ${Number(vh) + 2 * pad}`;
  const inner = svg
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "")
    .replace(/currentColor/g, color);
  const bg = background ? `<rect x="${x - pad}" y="${y - pad}" width="${Number(vw) + 2 * pad}" height="${Number(vh) + 2 * pad}" fill="${background}"/>` : "";
  const body = `<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(2)}" height="${h.toFixed(2)}" viewBox="${box}">${bg}${inner}</svg>`;
  return { w, h, body };
}

export function useDebouncedValue(value, ms = 150) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
