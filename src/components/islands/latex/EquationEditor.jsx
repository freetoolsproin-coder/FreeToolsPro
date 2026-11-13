import { useEffect, useRef, useState } from "react";
import { CopyButton } from "../ui.jsx";
import { Preview, Seg, insertAt, useDebouncedValue, useEngine, receive } from "./common.jsx";

const R = String.raw;
const SAMPLE = R`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`;
const GROUPS = [
  ["Structures", [["a/b", R`\frac{|}{}`], ["x²", "^{|}"], ["xₙ", "_{|}"], ["√", R`\sqrt{|}`], ["ⁿ√", R`\sqrt[n]{|}`], ["( )", R`\left( | \right)`], ["[ ]", R`\left[ | \right]`], ["{ }", R`\left\{ | \right\}`], ["| |", R`\left| | \right|`], ["binom", R`\binom{|}{}`]]],
  ["Calculus", [["∑", R`\sum_{i=1}^{n} `], ["∏", R`\prod_{i=1}^{n} `], ["∫", R`\int_{a}^{b} `], ["∬", R`\iint `], ["∮", R`\oint `], ["lim", R`\lim_{x \to 0} `], ["d/dx", R`\frac{d}{dx} `], ["∂", R`\partial `], ["∇", R`\nabla `], ["∞", R`\infty `]]],
  ["Greek", [["α", R`\alpha `], ["β", R`\beta `], ["γ", R`\gamma `], ["δ", R`\delta `], ["θ", R`\theta `], ["λ", R`\lambda `], ["μ", R`\mu `], ["π", R`\pi `], ["σ", R`\sigma `], ["φ", R`\phi `], ["ω", R`\omega `], ["Δ", R`\Delta `], ["Σ", R`\Sigma `], ["Ω", R`\Omega `]]],
  ["Relations", [["≤", R`\leq `], ["≥", R`\geq `], ["≠", R`\neq `], ["≈", R`\approx `], ["≡", R`\equiv `], ["±", R`\pm `], ["×", R`\times `], ["÷", R`\div `], ["·", R`\cdot `], ["→", R`\to `], ["⇒", R`\Rightarrow `], ["∈", R`\in `], ["⊂", R`\subset `], ["∪", R`\cup `], ["∩", R`\cap `], ["∀", R`\forall `], ["∃", R`\exists `]]],
  ["Layout", [["Matrix", R`\begin{bmatrix} a & b \\ c & d \end{bmatrix}`], ["Cases", R`\begin{cases} x & x > 0 \\ -x & x \le 0 \end{cases}`], ["Aligned", R`\begin{aligned} a &= b + c \\ d &= e \end{aligned}`], ["Text", R`\text{|}`], ["Bold", R`\mathbf{|}`], ["ℝ", R`\mathbb{R}`], ["Hat", R`\hat{|}`], ["Bar", R`\bar{|}`], ["Vector", R`\vec{|}`], ["Space", R`\quad `]]],
];

export default function EquationEditor() {
  const engine = useEngine();
  const [tex, setTex] = useState(SAMPLE);
  const [display, setDisplay] = useState("display");
  const [size, setSize] = useState(150);
  const [group, setGroup] = useState("Structures");
  const ref = useRef(null);
  const shown = useDebouncedValue(tex, 120);

  useEffect(() => {
    const sent = receive();
    if (sent) return setTex(sent);
    const m = location.hash.match(/^#tex=(.+)$/);
    if (m)
      try {
        setTex(decodeURIComponent(m[1]));
      } catch {}
  }, []);

  const isDisplay = display === "display";
  const mml = () => engine?.texToMathml?.(tex, { display: isDisplay }).mathml || "";
  const shareLink = () => `${location.origin}${location.pathname}#tex=${encodeURIComponent(tex)}`;

  return (
    <div className="ltx">
      <div className="panel ltx-pad">
        <div className="seg seg--wrap ltx-tabs" role="tablist" aria-label="Symbol groups">
          {GROUPS.map(([g]) => (
            <button key={g} type="button" role="tab" aria-selected={group === g} className="seg__opt" onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
        <div className="ltx-keys" role="toolbar" aria-label={`${group} buttons`}>
          {GROUPS.find(([g]) => g === group)[1].map(([label, snip]) => (
            <button key={label} type="button" className="ltx-key" title={snip.replace("|", "")} onClick={() => insertAt(ref, tex, setTex, snip)}>
              {label}
            </button>
          ))}
        </div>
        <div className="io__bar">
          <label className="field__label" htmlFor="ltx-src">
            LaTeX
          </label>
          <div className="io__tools">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setTex("")} disabled={!tex}>
              Clear
            </button>
          </div>
        </div>
        <textarea id="ltx-src" ref={ref} className="input textarea ltx-code" rows={5} value={tex} onChange={(e) => setTex(e.target.value)} spellCheck="false" autoCapitalize="off" autoCorrect="off" placeholder="Type LaTeX, or use the buttons above" />
      </div>
      <div className="panel ltx-pad">
        <div className="ltx-row">
          <Seg label="Style" value={display} onChange={setDisplay} options={[["display", "Display"], ["inline", "Inline"]]} />
          <div className="field ltx-grow">
            <label className="field__label" htmlFor="ltx-zoom">
              Preview size: {size}%
            </label>
            <input id="ltx-zoom" type="range" min="80" max="300" step="10" value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </div>
        </div>
        <Preview engine={engine} tex={shown} display={isDisplay} style={{ fontSize: `${size}%` }} />
        <div className="ltx-actions">
          <CopyButton text={() => tex} label="Copy LaTeX" className="btn--primary" />
          <CopyButton text={() => (isDisplay ? `\\[\n${tex}\n\\]` : `$${tex}$`)} label={isDisplay ? "Copy with \\[ \\]" : "Copy with $ $"} />
          <CopyButton text={mml} label="Copy MathML" />
          <CopyButton text={shareLink} label="Copy share link" />
          <a className="btn btn--ghost btn--sm" href={`/latex-tools/latex-equation-to-image#tex=${encodeURIComponent(tex)}`}>
            Save as image
          </a>
          <a className="btn btn--ghost btn--sm" href={`/latex-tools/latex-equation-to-word#tex=${encodeURIComponent(tex)}`}>
            Send to Word
          </a>
        </div>
      </div>
    </div>
  );
}
