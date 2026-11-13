import { useEffect, useRef, useState } from "react";
import { DownloadButton, downloadBlob } from "../ui.jsx";
import { loadEngine, receive } from "./common.jsx";

const SAMPLE = String.raw`\documentclass[11pt,a4paper]{article}
\usepackage{amsmath}
\usepackage[margin=1in]{geometry}

\title{Solving Quadratic Equations}
\author{FreeToolsPro}
\date{\today}

\begin{document}

\maketitle

\section{The formula}

Every equation $ax^2 + bx + c = 0$ with $a \neq 0$ has the roots
\begin{equation}\label{eq:roots}
  x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}.
\end{equation}

\section{Reading the discriminant}

The value $D = b^2 - 4ac$ in Equation~\eqref{eq:roots} tells us:
\begin{itemize}
  \item if $D > 0$, there are two real roots;
  \item if $D = 0$, there is one repeated root;
  \item if $D < 0$, the roots are complex.
\end{itemize}

\begin{table}[htbp]
  \centering
  \caption{Three examples}
  \begin{tabular}{lcc}
    \hline
    Equation & $D$ & Roots \\
    \hline
    $x^2 - 3x + 2 = 0$ & 1 & 1, 2 \\
    $x^2 - 2x + 1 = 0$ & 0 & 1 \\
    $x^2 + 1 = 0$ & $-4$ & $\pm i$ \\
    \hline
  \end{tabular}
\end{table}

\end{document}
`;

async function renderPages(bytes, host) {
  const [pdfjs, worker] = await Promise.all([import("pdfjs-dist/legacy/build/pdf.mjs"), import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url")]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  const canvases = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 1.6 });
    const c = document.createElement("canvas");
    c.width = vp.width;
    c.height = vp.height;
    c.setAttribute("role", "img");
    c.setAttribute("aria-label", `Page ${i} of ${doc.numPages}`);
    await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    canvases.push(c);
    page.cleanup();
  }
  host.replaceChildren(...canvases);
  await doc.destroy();
}

export default function LatexToPdf() {
  const [src, setSrc] = useState(SAMPLE);
  const [busy, setBusy] = useState(true);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const pages = useRef(null);
  const fileRef = useRef(null);

  const compile = async (text) => {
    setBusy(true);
    setErr("");
    try {
      const [{ compileLatex }, eng] = await Promise.all([import("../../../tools/latex/pdf.js"), loadEngine()]);
      const r = await compileLatex(text, eng.texToSvg);
      setRes(r);
      await renderPages(r.bytes, pages.current);
    } catch (e) {
      setErr(`Could not compile: ${e.message || "unknown error"}`);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const sent = receive();
    if (sent) setSrc(sent);
    compile(sent || SAMPLE);
  }, []);

  const open = async (e) => {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    const t = await f.text();
    setSrc(t);
    compile(t);
  };
  const errors = res?.log.filter((l) => l.level === "error") || [];
  const warns = res?.log.filter((l) => l.level !== "error") || [];

  return (
    <div className="ltx">
      <div className="ltx-pdf">
        <div className="panel ltx-pad">
          <div className="io__bar">
            <label className="field__label" htmlFor="ltx-src">
              main.tex
            </label>
            <div className="io__tools">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => fileRef.current.click()}>
                Open .tex
              </button>
              <input ref={fileRef} type="file" className="visually-hidden" accept=".tex,.txt,text/*" onChange={open} />
              <DownloadButton text={src} name="main.tex" mime="text/x-tex" label="Save .tex" />
            </div>
          </div>
          <textarea id="ltx-src" className="input textarea ltx-code ltx-editor" value={src} onChange={(e) => setSrc(e.target.value)} onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === "Enter" && compile(src)} spellCheck="false" autoCapitalize="off" />
          <div className="ltx-actions">
            <button type="button" className="btn btn--primary" onClick={() => compile(src)} disabled={busy}>
              {busy ? "Compiling…" : "Compile"}
            </button>
            <button type="button" className="btn btn--ghost" disabled={!res || busy} onClick={() => downloadBlob(new Blob([res.bytes], { type: "application/pdf" }), "main.pdf")}>
              Download PDF
            </button>
            {res && <span className="muted">{res.pages} {res.pages === 1 ? "page" : "pages"}</span>}
          </div>
          {err && (
            <p className="msg msg--error" role="alert">
              {err}
            </p>
          )}
          {res && (
            <div className="ltx-log" aria-live="polite">
              {!res.log.length && <p className="ltx-log__ok">Compiled with no warnings.</p>}
              {errors.map((l, i) => (
                <p key={`e${i}`} className="ltx-log__err">{l.msg}</p>
              ))}
              {warns.map((l, i) => (
                <p key={`w${i}`} className="ltx-log__warn">{l.msg}</p>
              ))}
            </div>
          )}
        </div>
        <div className="ltx-pages" ref={pages} aria-label="PDF preview"></div>
      </div>
    </div>
  );
}
