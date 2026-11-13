import { useEffect, useMemo, useState } from "react";
import { CopyButton, downloadBlob } from "../ui.jsx";
import { Seg, Tex, useDebouncedValue, useEngine } from "./common.jsx";

const R = String.raw;
const SAMPLE_EQ = [R`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`, R`\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}`, R`\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}`].join("\n\n");
const SAMPLE_TEXT = R`The area of a circle of radius $r$ is $A = \pi r^2$. For the sphere we have

$$V = \frac{4}{3}\pi r^3$$

Blank lines start a new paragraph in Word.`;

export default function LatexToWord() {
  const engine = useEngine();
  const [mode, setMode] = useState("equations");
  const [src, setSrc] = useState(SAMPLE_EQ);
  const [lib, setLib] = useState(null);
  const shown = useDebouncedValue(src, 150);

  useEffect(() => {
    import("../../../tools/latex/docx.js").then(setLib);
    const m = location.hash.match(/^#tex=(.+)$/);
    if (m)
      try {
        setSrc(decodeURIComponent(m[1]));
      } catch {}
  }, []);

  const toMml = (tex, display) => engine.texToMathml(tex, { display });
  const built = useMemo(() => (engine?.texToMathml && lib ? lib.buildDocumentXml(shown, mode, toMml) : null), [engine, lib, shown, mode]);
  const previews = useMemo(() => {
    const blocks = shown.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    if (mode === "equations") return blocks.map((b) => [{ math: b, display: true }]);
    return lib ? blocks.map((b) => lib.splitMixed(b.replace(/\s*\n\s*/g, " "))) : [];
  }, [shown, mode, lib]);
  const mathml = () =>
    previews
      .flat()
      .filter((p) => p.math)
      .map((p) => toMml(p.math, p.display).mathml || "")
      .join("\n");

  const save = () => downloadBlob(new Blob([lib.buildDocx(built.xml)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), "equations.docx");
  const change = (m) => {
    setMode(m);
    if (src === SAMPLE_EQ || src === SAMPLE_TEXT) setSrc(m === "equations" ? SAMPLE_EQ : SAMPLE_TEXT);
  };

  return (
    <div className="ltx">
      <div className="panel ltx-pad">
        <Seg label="Input" value={mode} onChange={change} options={[["equations", "Equations only"], ["text", "Text with $…$"]]} />
        <div className="io__bar">
          <label className="field__label" htmlFor="ltx-src">
            {mode === "equations" ? "LaTeX equations, separated by a blank line" : "Text with $inline$ and $$display$$ maths"}
          </label>
          <div className="io__tools">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSrc("")} disabled={!src}>
              Clear
            </button>
          </div>
        </div>
        <textarea id="ltx-src" className="input textarea ltx-code" rows={8} value={src} onChange={(e) => setSrc(e.target.value)} spellCheck="false" autoCapitalize="off" />
        <div className="ltx-actions">
          <button type="button" className="btn btn--primary btn--sm" disabled={!built?.count} onClick={save}>
            Download .docx
          </button>
          <CopyButton text={mathml} label="Copy MathML" />
          {built && <span className="muted">{built.count} {built.count === 1 ? "equation" : "equations"}</span>}
        </div>
        {built?.errors.map((e) => (
          <p key={e} className="msg msg--error" role="alert">
            {e}
          </p>
        ))}
        <p className="hint">The .docx opens with real Word equations you can click and edit. To add one to an open document, copy the MathML and paste it into Word with Keep Text Only.</p>
      </div>
      <div className="panel ltx-pad">
        <span className="field__label">Preview</span>
        <div className="ltx-docprev">
          {previews.map((parts, i) => (
            <p key={i} className={parts.length === 1 && parts[0].math ? "is-eq" : ""}>
              {parts.map((p, j) => (p.math ? <Tex key={j} engine={engine} tex={p.math} display={!!p.display} /> : <span key={j}>{p.text}</span>))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
