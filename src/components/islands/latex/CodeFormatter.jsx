import { useMemo, useState } from "react";
import { formatLatex } from "../../../tools/latex/builders.js";
import { CopyButton, DownloadButton } from "../ui.jsx";
import { Seg, Toggle, sendTo } from "./common.jsx";

const SAMPLE = String.raw`\documentclass{article}
\usepackage{amsmath}
\begin{document}
\section{Results} We found two things. \begin{itemize} \item The first. \item The second.
\end{itemize}
\begin{tabular}{lr}
\hline
Name & Score \\
\hline
Asha & 91 \\
Vikram Iyer & 8 \\
\hline
\end{tabular}


\begin{align}
x &= 1 + 2 \\
yy &= 3
\end{align}
\end{document}`;

export default function CodeFormatter() {
  const [src, setSrc] = useState(SAMPLE);
  const [indent, setIndent] = useState("2");
  const [alignTables, setAlign] = useState(true);
  const [splitLines, setSplit] = useState(true);
  const [sectionGap, setGap] = useState(true);
  const r = useMemo(() => formatLatex(src, { indent: Number(indent), alignTables, splitLines, sectionGap }), [src, indent, alignTables, splitLines, sectionGap]);

  return (
    <div className="ltx">
      <div className="panel ltx-pad ltx-row">
        <Seg label="Indent" value={indent} onChange={setIndent} options={[["2", "2 spaces"], ["4", "4 spaces"]]} />
        <Toggle label="Align & columns" checked={alignTables} onChange={setAlign} />
        <Toggle label="One \begin, \end and \item per line" checked={splitLines} onChange={setSplit} />
        <Toggle label="Blank line before sections" checked={sectionGap} onChange={setGap} />
      </div>
      <div className="io io--split">
        <div className="io__pane">
          <div className="io__bar">
            <label className="field__label" htmlFor="ltx-in">
              Your LaTeX
            </label>
            <div className="io__tools">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSrc("")} disabled={!src}>
                Clear
              </button>
            </div>
          </div>
          <textarea id="ltx-in" className="input textarea ltx-code ltx-tall" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck="false" autoCapitalize="off" />
        </div>
        <div className="io__pane">
          <div className="io__bar">
            <label className="field__label" htmlFor="ltx-out">
              Formatted
            </label>
            <div className="io__tools">
              <CopyButton text={() => r.text} />
              <DownloadButton text={r.text} name="formatted.tex" mime="text/x-tex" />
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => sendTo("/latex-tools/latex-to-pdf", r.text)} disabled={!r.text}>
                Compile
              </button>
            </div>
          </div>
          <textarea id="ltx-out" className="input textarea textarea--out ltx-code ltx-tall" value={r.text} readOnly spellCheck="false" />
        </div>
      </div>
      {r.unbalanced && (
        <p className="msg msg--error" role="alert">
          Check your environments: {r.unbalanced.map((e) => `\\begin{${e}}`).join(", ")} has no matching \end.
        </p>
      )}
    </div>
  );
}
