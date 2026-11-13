import { useMemo, useState } from "react";
import { mathmlToLatex } from "../../../tools/latex/mathml-to-latex.js";
import { CopyButton } from "../ui.jsx";
import { Preview, Seg, useDebouncedValue, useEngine } from "./common.jsx";

const SAMPLE = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mrow>
    <mi>x</mi>
    <mo>=</mo>
    <mfrac>
      <mrow>
        <mo>-</mo>
        <mi>b</mi>
        <mo>&#xB1;</mo>
        <msqrt>
          <msup><mi>b</mi><mn>2</mn></msup>
          <mo>-</mo>
          <mn>4</mn><mi>a</mi><mi>c</mi>
        </msqrt>
      </mrow>
      <mrow><mn>2</mn><mi>a</mi></mrow>
    </mfrac>
  </mrow>
</math>`;

export default function MathmlToLatex() {
  const engine = useEngine();
  const [src, setSrc] = useState(SAMPLE);
  const [wrap, setWrap] = useState("none");
  const shown = useDebouncedValue(src, 120);

  const { tex, error } = useMemo(() => {
    try {
      return { tex: mathmlToLatex(shown) };
    } catch (e) {
      return { tex: "", error: e.message };
    }
  }, [shown]);
  const output = !tex ? "" : wrap === "inline" ? `$${tex}$` : wrap === "display" ? `\\[\n${tex}\n\\]` : tex;

  return (
    <div className="ltx">
      <div className="io io--split">
        <div className="io__pane">
          <div className="io__bar">
            <label className="field__label" htmlFor="ltx-in">
              MathML
            </label>
            <div className="io__tools">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSrc(SAMPLE)}>
                Sample
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSrc("")} disabled={!src}>
                Clear
              </button>
            </div>
          </div>
          <textarea id="ltx-in" className="input textarea ltx-code ltx-tall" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck="false" autoCapitalize="off" placeholder="Paste MathML starting with <math>" />
        </div>
        <div className="io__pane">
          <div className="io__bar">
            <label className="field__label" htmlFor="ltx-out">
              LaTeX
            </label>
            <div className="io__tools">
              <CopyButton text={() => output} />
            </div>
          </div>
          <textarea id="ltx-out" className="input textarea textarea--out ltx-code" rows={5} value={output} readOnly spellCheck="false" />
          <Seg label="Wrap in" value={wrap} onChange={setWrap} options={[["none", "Nothing"], ["inline", "$ $"], ["display", "\\[ \\]"]]} />
          {error && (
            <p className="msg msg--error" role="alert">
              {error}
            </p>
          )}
          <Preview engine={engine} tex={tex} empty="The converted equation appears here." />
        </div>
      </div>
    </div>
  );
}
