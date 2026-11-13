import { useEffect, useMemo, useState } from "react";
import { CopyButton, downloadBlob } from "../ui.jsx";
import { Num, Seg, Toggle, clamp, sizeSvg, svgToPng, useDebouncedValue, useEngine } from "./common.jsx";

const R = String.raw;
const SAMPLE = R`\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}`;

export default function EquationImage() {
  const engine = useEngine();
  const [tex, setTex] = useState(SAMPLE);
  const [fontPx, setFontPx] = useState(40);
  const [scale, setScale] = useState("3");
  const [color, setColor] = useState("#000000");
  const [bgMode, setBgMode] = useState("transparent");
  const [bg, setBg] = useState("#ffffff");
  const [padding, setPadding] = useState(12);
  const [inline, setInline] = useState(false);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const shown = useDebouncedValue(tex, 120);

  useEffect(() => {
    const m = location.hash.match(/^#tex=(.+)$/);
    if (m)
      try {
        setTex(decodeURIComponent(m[1]));
      } catch {}
  }, []);

  const r = useMemo(() => (engine?.texToSvg ? engine.texToSvg(shown, { display: !inline }) : null), [engine, shown, inline]);
  const background = bgMode === "transparent" ? null : bgMode === "white" ? "#ffffff" : bg;
  const opts = { fontPx: clamp(fontPx, 8, 200), padding: clamp(padding, 0, 80), color, background };
  const file = useMemo(() => (r?.svg ? sizeSvg(r.svg, opts.fontPx, opts.padding, color, background) : null), [r, opts.fontPx, opts.padding, color, background]);
  const px = file ? `${Math.ceil(file.w * Number(scale))} × ${Math.ceil(file.h * Number(scale))} px` : "";

  const png = () => svgToPng(r.svg, { ...opts, scale: Number(scale) });
  const run = async (label, fn) => {
    setErr("");
    setBusy(label);
    try {
      await fn();
    } catch (e) {
      setErr(e.message || "That did not work. Try again.");
    } finally {
      setTimeout(() => setBusy(""), 900);
    }
  };
  const copyPng = () =>
    run("Copied", async () => {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") throw new Error("This browser cannot copy images. Use Download PNG instead.");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": png() })]);
    });

  return (
    <div className="ltx">
      <div className="panel ltx-pad">
        <label className="field__label" htmlFor="ltx-src">
          LaTeX equation
        </label>
        <textarea id="ltx-src" className="input textarea ltx-code" rows={4} value={tex} onChange={(e) => setTex(e.target.value)} spellCheck="false" autoCapitalize="off" />
        <div className="ltx-row">
          <Num id="ltx-font" label="Font size" value={fontPx} onChange={setFontPx} min={8} max={200} unit="px" />
          <Num id="ltx-pad" label="Padding" value={padding} onChange={setPadding} min={0} max={80} unit="px" />
          <Seg label="PNG resolution" value={scale} onChange={setScale} options={[["1", "1×"], ["2", "2×"], ["3", "3×"], ["4", "4×"], ["8", "8×"]]} />
        </div>
        <div className="ltx-row">
          <div className="field">
            <label className="field__label" htmlFor="ltx-color">
              Text colour
            </label>
            <input id="ltx-color" className="ltx-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <Seg label="Background" value={bgMode} onChange={setBgMode} options={[["transparent", "Transparent"], ["white", "White"], ["custom", "Colour"]]} />
          {bgMode === "custom" && (
            <div className="field">
              <label className="field__label" htmlFor="ltx-bg">
                Background colour
              </label>
              <input id="ltx-bg" className="ltx-color" type="color" value={bg} onChange={(e) => setBg(e.target.value)} />
            </div>
          )}
          <Toggle label="Inline style" checked={inline} onChange={setInline} />
        </div>
      </div>
      <div className="panel ltx-pad">
        <div className="ltx-check" aria-live="polite">
          {!r ? <span className="muted">Loading the equation engine…</span> : r.error || !file ? <span className="muted">{r.error ? "Fix the LaTeX to see a preview." : "Type an equation to see a preview."}</span> : <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(file.body)}`} alt={tex} />}
        </div>
        {r?.error && (
          <p className="msg msg--error" role="alert">
            {r.error}
          </p>
        )}
        {err && (
          <p className="msg msg--error" role="alert">
            {err}
          </p>
        )}
        {file && <p className="hint">PNG size: {px}. SVG stays sharp at any size.</p>}
        <div className="ltx-actions">
          <button type="button" className="btn btn--primary btn--sm" disabled={!file} onClick={() => run("Saved", async () => downloadBlob(await png(), "equation.png"))}>
            Download PNG
          </button>
          <button type="button" className="btn btn--ghost btn--sm" disabled={!file} onClick={() => downloadBlob(new Blob([file.body], { type: "image/svg+xml" }), "equation.svg")}>
            Download SVG
          </button>
          <button type="button" className="btn btn--ghost btn--sm" disabled={!file} onClick={copyPng}>
            {busy === "Copied" ? "Copied" : "Copy PNG"}
          </button>
          <CopyButton text={() => file?.body || ""} label="Copy SVG code" />
        </div>
      </div>
    </div>
  );
}
