import { useEffect, useRef, useState } from "react";
import { CopyButton, DropZone } from "../ui.jsx";
import { Preview, sendTo, useDebouncedValue, useEngine } from "./common.jsx";

const MAX_SIDE = 2400;

/** Grey pixels for a canvas, in the form the reader expects. */
function grayOf(ctx, w, h) {
  const { data } = ctx.getImageData(0, 0, w, h);
  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0; i < gray.length; i++) gray[i] = data[i * 4 + 1];
  return { gray, width: w, height: h };
}

/** Draw an engine SVG on a canvas at 64 px to the em, by filling its paths. */
async function rasterSvg(svg) {
  const { svgShapes } = await import("../../../tools/latex/svg.js");
  const s = svgShapes(svg);
  const k = 64 / 1000;
  const w = Math.ceil(s.w * k) + 16;
  const h = Math.ceil((s.top + s.depth) * k) + 16;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  for (const shape of s.shapes) {
    ctx.setTransform(k, 0, 0, k, 8 - s.x * k, 8 + s.top * k);
    ctx.transform(...shape.m);
    ctx.fill(new Path2D(shape.d));
  }
  return grayOf(ctx, w, h);
}

/** Reference shapes in common document fonts, so screenshots from Word or the web also match. */
function fontTemplates(ocr) {
  const out = [];
  const c = document.createElement("canvas");
  c.width = c.height = 120;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  const fonts = ['italic 64px "Cambria Math", Cambria, serif', '64px "Cambria Math", Cambria, serif', 'italic 64px "Times New Roman", Times, serif', '64px "Times New Roman", Times, serif', "64px Arial, Helvetica, sans-serif", "italic 64px Arial, Helvetica, sans-serif"];
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+=<>()[]/".split("");
  for (const font of fonts)
    for (const ch of chars) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 120, 120);
      ctx.fillStyle = "#000";
      ctx.font = font;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(ch, 30, 80);
      const t = ocr.templateFromImage(grayOf(ctx, 120, 120), ch);
      if (t) out.push(t);
    }
  return out;
}

export default function ImageToLatex() {
  const engine = useEngine();
  const [img, setImg] = useState(null);
  const [tex, setTex] = useState("");
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const templates = useRef(null);
  const shown = useDebouncedValue(tex, 120);

  const read = async (file) => {
    setErr("");
    setInfo(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErr("Choose an image file: PNG, JPG or WebP.");
    const url = URL.createObjectURL(file);
    setImg((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
    setBusy("Reading the image…");
    try {
      const [{ loadEngine }, ocr] = await Promise.all([import("./common.jsx"), import("../../../tools/latex/ocr.js")]);
      const eng = await loadEngine();
      if (!templates.current) {
        setBusy("Preparing symbol shapes (first time only)…");
        await new Promise((r) => setTimeout(r, 30));
        templates.current = [...(await ocr.buildTemplates(eng.texToSvg, rasterSvg)), ...fontTemplates(ocr)];
        setBusy("Reading the image…");
      }
      const bmp = await new Promise((ok, no) => {
        const i = new Image();
        i.onload = () => ok(i);
        i.onerror = () => no(new Error("This image could not be opened."));
        i.src = url;
      });
      const f = Math.min(1, MAX_SIDE / Math.max(bmp.naturalWidth, bmp.naturalHeight));
      const [w, h] = [Math.round(bmp.naturalWidth * f), Math.round(bmp.naturalHeight * f)];
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      ctx.drawImage(bmp, 0, 0, w, h);
      await new Promise((r) => setTimeout(r, 30));
      const res = ocr.recognize(ctx.getImageData(0, 0, w, h), templates.current);
      setTex(res.tex);
      setInfo(res);
    } catch (e) {
      setErr(e.message || "This image could not be read.");
    } finally {
      setBusy("");
    }
  };

  useEffect(() => {
    const onPaste = (e) => {
      const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith("image/"));
      if (f) {
        e.preventDefault();
        read(f);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const level = info ? (info.confidence > 0.86 ? "Good match" : info.confidence > 0.72 ? "Fair match" : "Weak match") : "";

  return (
    <div className="ltx">
      <div className="panel ltx-pad">
        <DropZone accept="image/*" onFiles={(f) => read(f[0])} label="Choose an image of an equation" hint="Or drop it here, or paste a screenshot with Ctrl+V. It stays on your device." />
        {busy && (
          <p className="hint" role="status">
            {busy}
          </p>
        )}
        {err && (
          <p className="msg msg--error" role="alert">
            {err}
          </p>
        )}
        {img && (
          <figure className="ltx-shot">
            <img src={img} alt="The image you chose" />
          </figure>
        )}
      </div>
      <div className="panel ltx-pad">
        <div className="io__bar">
          <label className="field__label" htmlFor="ltx-src">
            Recognised LaTeX
            {info && <span className="field__count is-under">{level}, {info.symbols} symbols</span>}
          </label>
          <div className="io__tools">
            <CopyButton text={() => tex} label="Copy LaTeX" />
            <button type="button" className="btn btn--ghost btn--sm" disabled={!tex} onClick={() => sendTo("/latex-tools/latex-equation-editor", tex)}>
              Open in editor
            </button>
          </div>
        </div>
        <textarea id="ltx-src" className="input textarea ltx-code" rows={4} value={tex} onChange={(e) => setTex(e.target.value)} spellCheck="false" autoCapitalize="off" placeholder="The LaTeX appears here. Compare the preview with your image and correct anything that differs." />
        <Preview engine={engine} tex={shown} empty="The rendered result appears here." style={{ fontSize: "130%" }} />
        {info?.unsure.length > 0 && <p className="hint">Check these first, they were the hardest to read: {info.unsure.join("  ")}</p>}
      </div>
    </div>
  );
}
