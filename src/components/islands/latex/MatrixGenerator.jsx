import { useMemo, useState } from "react";
import { MATRIX_FILLS, matrixLatex } from "../../../tools/latex/builders.js";
import { CopyButton } from "../ui.jsx";
import { Num, Preview, Seg, clamp, useEngine } from "./common.jsx";

const ENVS = [
  ["bmatrix", "[ ]"],
  ["pmatrix", "( )"],
  ["vmatrix", "| |"],
  ["Vmatrix", "‖ ‖"],
  ["Bmatrix", "{ }"],
  ["matrix", "None"],
];
const blank = (r, c, fill, name) => Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => fill(i, j, name)));

export default function MatrixGenerator() {
  const engine = useEngine();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [env, setEnv] = useState("bmatrix");
  const [name, setName] = useState("a");
  const [cells, setCells] = useState(() => blank(3, 3, MATRIX_FILLS.symbolic, "a"));
  const [wrap, setWrap] = useState("none");

  const r = clamp(rows, 1, 10);
  const c = clamp(cols, 1, 10);
  const grid = useMemo(() => Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => cells[i]?.[j] ?? "")), [cells, r, c]);
  const code = useMemo(() => matrixLatex(grid, { env }), [grid, env]);
  const output = wrap === "equation" ? `\\begin{equation}\n${code}\n\\end{equation}` : wrap === "display" ? `\\[\n${code}\n\\]` : code;

  const edit = (i, j, v) => setCells(grid.map((row, a) => row.map((x, b) => (a === i && b === j ? v : x))));
  const fill = (kind) => setCells(blank(r, c, MATRIX_FILLS[kind], name.trim() || "a"));

  return (
    <div className="ltx">
      <div className="panel ltx-pad">
        <div className="ltx-row">
          <Num id="ltx-r" label="Rows" value={rows} onChange={setRows} min={1} max={10} />
          <Num id="ltx-c" label="Columns" value={cols} onChange={setCols} min={1} max={10} />
          <Seg label="Brackets" value={env} onChange={setEnv} options={ENVS} />
        </div>
        <div className="ltx-row ltx-row--end">
          <div className="field ltx-short">
            <label className="field__label" htmlFor="ltx-name">
              Letter
            </label>
            <input id="ltx-name" className="input" maxLength={8} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fill("symbolic")}>
            Fill a₁₁, a₁₂…
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fill("identity")}>
            Identity
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fill("zero")}>
            Zeros
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fill("blank")}>
            Clear
          </button>
        </div>
        <div className="ltx-gridwrap">
          <table className="ltx-grid" aria-label="Matrix entries">
            <tbody>
              {grid.map((row, i) => (
                <tr key={i}>
                  {row.map((v, j) => (
                    <td key={j}>
                      <input className="input" aria-label={`Row ${i + 1}, column ${j + 1}`} value={v} onChange={(e) => edit(i, j, e.target.value)} spellCheck="false" autoCapitalize="off" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hint">Entries accept LaTeX, such as \frac12 or \cdots. Press Tab to move to the next cell.</p>
      </div>
      <div className="panel ltx-pad">
        <Preview engine={engine} tex={code} style={{ fontSize: "130%" }} />
        <div className="ltx-row">
          <Seg label="Wrap the code in" value={wrap} onChange={setWrap} options={[["none", "Nothing"], ["display", "\\[ \\]"], ["equation", "equation"]]} />
        </div>
        <div className="out">
          <div className="io__bar">
            <span className="field__label">LaTeX</span>
            <div className="io__tools">
              <CopyButton text={() => output} label="Copy code" />
            </div>
          </div>
          <pre className="code">
            <code>{output}</code>
          </pre>
        </div>
        <p className="hint">These environments need \usepackage{"{amsmath}"} in your document.</p>
      </div>
    </div>
  );
}
