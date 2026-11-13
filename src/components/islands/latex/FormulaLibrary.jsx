import { useMemo, useState } from "react";
import { FORMULA_GROUPS } from "../../../tools/latex/formulas.js";
import { CopyButton } from "../ui.jsx";
import { Tex, useEngine } from "./common.jsx";

export default function FormulaLibrary() {
  const engine = useEngine();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    return FORMULA_GROUPS.filter((g) => group === "all" || g.id === group)
      .map((g) => ({ ...g, items: g.items.filter(([name, tex, note]) => !s || name.toLowerCase().includes(s) || tex.toLowerCase().includes(s) || note.toLowerCase().includes(s) || g.name.toLowerCase().includes(s)) }))
      .filter((g) => g.items.length);
  }, [q, group]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="ltx">
      <div className="panel ltx-pad">
        <div className="field">
          <label className="field__label" htmlFor="ltx-q">
            Search formulas
          </label>
          <input id="ltx-q" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try: quadratic, Bayes, Ohm, integral" />
        </div>
        <div className="chips ltx-chips">
          {[{ id: "all", name: "All" }, ...FORMULA_GROUPS].map((g) => (
            <button key={g.id} type="button" className={`chip chip--btn ${group === g.id ? "is-on" : ""}`} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
              {g.name}
            </button>
          ))}
        </div>
        <p className="hint" aria-live="polite">
          {total} {total === 1 ? "formula" : "formulas"}
        </p>
      </div>
      {groups.map((g) => (
        <section key={g.id} className="ltx-group">
          <h2 className="ltx-group__h">{g.name}</h2>
          <ul className="ltx-formulas">
            {g.items.map(([name, tex, note]) => (
              <li key={name} className="ltx-formula">
                <div className="ltx-formula__head">
                  <h3>{name}</h3>
                  <CopyButton text={() => tex} label="Copy" />
                </div>
                <div className="ltx-formula__math">
                  <Tex engine={engine} tex={tex} label={name} />
                </div>
                {note && <p className="hint">{note}</p>}
                <details className="ltx-formula__src">
                  <summary>LaTeX code</summary>
                  <code>{tex}</code>
                  <a href={`/latex-tools/latex-equation-editor#tex=${encodeURIComponent(tex)}`}>Open in the equation editor</a>
                </details>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {!total && <p className="ltx-empty">No formula matches “{q}”.</p>}
    </div>
  );
}
