import { useMemo, useState } from "react";
import { parseGrid, tableLatex } from "../../../tools/latex/builders.js";
import { CopyButton, DownloadButton } from "../ui.jsx";
import { Seg, Toggle } from "./common.jsx";

const START = [
  ["Item", "Quantity", "Price"],
  ["Notebook", "3", "₹120"],
  ["Pen", "10", "₹50"],
];

export default function TableGenerator() {
  const [rows, setRows] = useState(START);
  const [aligns, setAligns] = useState(["l", "c", "r"]);
  const [style, setStyle] = useState("booktabs");
  const [header, setHeader] = useState(true);
  const [caption, setCaption] = useState("Purchase list");
  const [label, setLabel] = useState("tab:purchases");
  const [isFloat, setFloat] = useState(true);
  const [escape, setEscape] = useState(true);
  const [paste, setPaste] = useState("");
  const [note, setNote] = useState("");

  const cols = Math.max(1, ...rows.map((r) => r.length));
  const code = useMemo(() => tableLatex(rows, { aligns, style, header, caption, label, float: isFloat, escape }), [rows, aligns, style, header, caption, label, isFloat, escape]);

  const edit = (i, j, v) => setRows(rows.map((r, a) => (a === i ? Array.from({ length: cols }, (_, b) => (b === j ? v : r[b] ?? "")) : r)));
  const addRow = () => setRows([...rows, Array(cols).fill("")]);
  const addCol = () => setRows(rows.map((r) => [...r, ""]));
  const delRow = () => rows.length > 1 && setRows(rows.slice(0, -1));
  const delCol = () => cols > 1 && setRows(rows.map((r) => r.slice(0, cols - 1)));
  const setAlign = (j, v) => setAligns(Array.from({ length: cols }, (_, b) => (b === j ? v : aligns[b] || "l")));
  const importGrid = () => {
    const g = parseGrid(paste);
    if (!g.length) return setNote("Nothing to import yet. Paste your cells first.");
    setRows(g);
    setNote(`Imported ${g.length} rows and ${Math.max(...g.map((r) => r.length))} columns.`);
    setPaste("");
  };

  return (
    <div className="ltx">
      <div className="panel ltx-pad">
        <details className="ltx-paste">
          <summary>Paste from Excel, Google Sheets or CSV</summary>
          <label className="visually-hidden" htmlFor="ltx-paste">
            Cells to import
          </label>
          <textarea id="ltx-paste" className="input textarea ltx-code" rows={4} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="Copy the cells in your spreadsheet and paste them here" />
          <button type="button" className="btn btn--ghost btn--sm" onClick={importGrid}>
            Import
          </button>
        </details>
        {note && <p className="hint" aria-live="polite">{note}</p>}
        <div className="ltx-gridwrap">
          <table className="ltx-grid ltx-grid--wide" aria-label="Table cells">
            <thead>
              <tr>
                {Array.from({ length: cols }, (_, j) => (
                  <th key={j} scope="col">
                    <select className="select" aria-label={`Column ${j + 1} alignment`} value={aligns[j] || "l"} onChange={(e) => setAlign(j, e.target.value)}>
                      <option value="l">Left</option>
                      <option value="c">Centre</option>
                      <option value="r">Right</option>
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {Array.from({ length: cols }, (_, j) => (
                    <td key={j}>
                      <input className="input" aria-label={`Row ${i + 1}, column ${j + 1}`} value={r[j] ?? ""} onChange={(e) => edit(i, j, e.target.value)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ltx-actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={addRow}>
            Add row
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={addCol}>
            Add column
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={delRow} disabled={rows.length < 2}>
            Remove row
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={delCol} disabled={cols < 2}>
            Remove column
          </button>
        </div>
      </div>
      <div className="panel ltx-pad">
        <div className="ltx-row">
          <Seg label="Style" value={style} onChange={setStyle} options={[["booktabs", "Booktabs"], ["grid", "Full grid"], ["lines", "Header lines"], ["plain", "No lines"]]} />
        </div>
        <div className="ltx-row">
          <Toggle label="First row is a header" checked={header} onChange={setHeader} />
          <Toggle label="Table with caption" checked={isFloat} onChange={setFloat} />
          <Toggle label="Escape % & # _" checked={escape} onChange={setEscape} />
        </div>
        {isFloat && (
          <div className="ltx-row">
            <div className="field ltx-grow">
              <label className="field__label" htmlFor="ltx-cap">
                Caption
              </label>
              <input id="ltx-cap" className="input" value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div className="field ltx-grow">
              <label className="field__label" htmlFor="ltx-lab">
                Label
              </label>
              <input id="ltx-lab" className="input" value={label} onChange={(e) => setLabel(e.target.value)} spellCheck="false" />
            </div>
          </div>
        )}
        <div className="out">
          <div className="io__bar">
            <span className="field__label">LaTeX</span>
            <div className="io__tools">
              <CopyButton text={() => code} label="Copy code" />
              <DownloadButton text={code} name="table.tex" mime="text/x-tex" label="Download .tex" />
            </div>
          </div>
          <pre className="code">
            <code>{code}</code>
          </pre>
        </div>
        {style === "booktabs" && <p className="hint">Add \usepackage{"{booktabs}"} to your document for these rules.</p>}
      </div>
    </div>
  );
}
