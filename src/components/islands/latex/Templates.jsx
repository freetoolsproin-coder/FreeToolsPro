import { useMemo, useState } from "react";
import { TEMPLATES, fillTemplate } from "../../../tools/latex/templates.js";
import { CopyButton, DownloadButton } from "../ui.jsx";
import { sendTo } from "./common.jsx";

const GROUPS = [...new Set(TEMPLATES.map((t) => t.group))];
const defaults = (t) => Object.fromEntries(t.fields.map((f) => [f.id, f.def]));

export default function Templates() {
  const [id, setId] = useState("resume");
  const t = TEMPLATES.find((x) => x.id === id);
  const [values, setValues] = useState(() => defaults(t));
  const tex = useMemo(() => fillTemplate(t, values), [t, values]);
  const pick = (next) => {
    setId(next.id);
    setValues(defaults(next));
  };

  return (
    <div className="ltx">
      {GROUPS.map((g) => (
        <section key={g} className="ltx-group">
          <h2 className="ltx-group__h">{g}</h2>
          <ul className="ltx-cards">
            {TEMPLATES.filter((x) => x.group === g).map((x) => (
              <li key={x.id}>
                <button type="button" className={`ltx-card ${x.id === id ? "is-on" : ""}`} aria-pressed={x.id === id} onClick={() => pick(x)}>
                  <strong>{x.name}</strong>
                  <span>{x.desc}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="panel ltx-pad">
        <h2 className="ltx-group__h">Your details</h2>
        <div className="ltx-fields">
          {t.fields.map((f) => (
            <div key={f.id} className="field">
              <label className="field__label" htmlFor={`ltx-f-${f.id}`}>
                {f.label}
              </label>
              <input id={`ltx-f-${f.id}`} className="input" value={values[f.id] ?? ""} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} />
            </div>
          ))}
        </div>
      </div>
      <div className="panel ltx-pad">
        <div className="io__bar">
          <span className="field__label">{t.name}</span>
          <div className="io__tools">
            <CopyButton text={() => tex} label="Copy code" />
            <DownloadButton text={tex} name={`${t.id}.tex`} mime="text/x-tex" label="Download .tex" />
            <button type="button" className="btn btn--primary btn--sm" onClick={() => sendTo("/latex-tools/latex-to-pdf", tex)}>
              Compile to PDF
            </button>
          </div>
        </div>
        <pre className="code ltx-codebox">
          <code>{tex}</code>
        </pre>
      </div>
    </div>
  );
}
