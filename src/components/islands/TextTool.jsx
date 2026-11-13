import { useEffect, useMemo, useRef, useState } from "react";
import { TEXTS } from "../../tools/texts.js";
import { Field, CopyButton, DownloadButton, DataTable, Checks } from "./ui.jsx";

// The first render must be identical on the server and in the browser (hydration), so it
// runs with `_ssr: true`; tools then skip anything time- or randomness-dependent.
function initialResult(cfg, input, opts, input2) {
  if (cfg.clientOnly || cfg.noInput) return null;
  try {
    const r = cfg.run(input, { ...opts, _ssr: true }, input2);
    return r && typeof r.then === "function" ? null : r;
  } catch {
    return null;
  }
}

export default function TextTool({ id }) {
  const cfg = TEXTS[id];
  const defaults = useMemo(() => Object.fromEntries((cfg.options || []).map((o) => [o.id, o.def])), [id]);
  const [input, setInput] = useState(cfg.sample ?? "");
  const [input2, setInput2] = useState(cfg.sample2 ?? "");
  const [opts, setOpts] = useState({ ...defaults, _seed: 7 });
  const [res, setRes] = useState(() => initialResult(cfg, cfg.sample ?? "", { ...defaults, _seed: 7 }, cfg.sample2 ?? ""));
  const [busy, setBusy] = useState(false);
  const runId = useRef(0);
  const fileRef = useRef(null);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const my = ++runId.current;
    const delay = input.length > 20000 ? 250 : 60;
    const t = setTimeout(async () => {
      try {
        const r = cfg.run(input, opts, input2);
        if (r && typeof r.then === "function") {
          setBusy(true);
          const out = await r;
          if (my === runId.current) setRes(out);
        } else if (my === runId.current) setRes(r);
      } catch (e) {
        if (my === runId.current) setRes({ error: e.message || "Something went wrong with this input." });
      } finally {
        if (my === runId.current) setBusy(false);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [input, input2, opts, id]);

  const setOpt = (k) => (v) => setOpts((p) => ({ ...p, [k]: v }));
  const visibleOpts = (cfg.options || []).filter((o) => !o.show || o.show(opts));
  const hasOutput = res && (res.output !== undefined || res.outputs);
  const loadFile = async (e) => {
    const f = e.target.files[0];
    if (f) setInput(await f.text());
    e.target.value = "";
  };

  const inputBox = cfg.noInput ? null : cfg.inputType === "line" || cfg.inputType === "password" ? (
    <div className="field">
      <label className="field__label" htmlFor={`${id}-in`}>
        {cfg.inputLabel || (cfg.inputType === "password" ? "Password" : "Input")}
      </label>
      <div className="line-in">
        <input
          id={`${id}-in`}
          className="input input--lg"
          type={cfg.inputType === "password" && !showPw ? "password" : "text"}
          value={input}
          autoComplete="off"
          spellCheck="false"
          onChange={(e) => setInput(e.target.value)}
        />
        {cfg.inputType === "password" && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShowPw((s) => !s)} aria-pressed={showPw}>
            {showPw ? "Hide" : "Show"}
          </button>
        )}
        {cfg.nowButton && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}>
            Now
          </button>
        )}
      </div>
    </div>
  ) : (
    <div className="io__pane">
      <div className="io__bar">
        <label className="field__label" htmlFor={`${id}-in`}>
          {cfg.inputLabel || "Input"}
        </label>
        <div className="io__tools">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fileRef.current.click()}>
            Open file
          </button>
          <input ref={fileRef} type="file" className="visually-hidden" accept=".txt,.json,.csv,.xml,.yaml,.yml,.sql,.md,.html,.css,.js,text/*" onChange={loadFile} />
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setInput("")} disabled={!input}>
            Clear
          </button>
        </div>
      </div>
      <textarea id={`${id}-in`} className="input textarea" value={input} spellCheck="false" onChange={(e) => setInput(e.target.value)} rows={12} />
      {cfg.input2Label !== undefined && (
        <>
          <label className="field__label" htmlFor={`${id}-in2`}>
            {cfg.input2Label}
          </label>
          <textarea id={`${id}-in2`} className="input textarea" value={input2} spellCheck="false" onChange={(e) => setInput2(e.target.value)} rows={12} />
        </>
      )}
    </div>
  );

  return (
    <div className={`texttool ${cfg.noInput ? "texttool--gen" : ""}`}>
      {visibleOpts.length > 0 && (
        <div className="optbar panel">
          {visibleOpts.map((o) => (
            <Field key={o.id} spec={o} value={opts[o.id]} onChange={setOpt(o.id)} />
          ))}
          {cfg.noInput && (
            <button type="button" className="btn btn--primary" onClick={() => setOpts((p) => ({ ...p, _seed: (p._seed || 1) + 1 }))}>
              Generate again
            </button>
          )}
        </div>
      )}
      <div className={`io ${inputBox && cfg.inputType !== "line" && cfg.inputType !== "password" ? "io--split" : ""}`}>
        {inputBox}
        <div className="io__pane io__pane--out" aria-live="polite" aria-busy={busy}>
          <Result res={res} id={id} cfg={cfg} busy={busy} />
        </div>
      </div>
    </div>
  );
}

function Result({ res, id, cfg, busy }) {
  if (!res) return <p className="muted">Working…</p>;
  return (
    <>
      {res.error && (
        <p className="msg msg--error" role="alert">
          {res.error}
        </p>
      )}
      {res.info && <p className="msg">{res.info}</p>}
      {res.meter && (
        <div className="meter" data-level={res.meter.value}>
          <div className="meter__bar">
            {Array.from({ length: res.meter.max }, (_, i) => (
              <span key={i} className={i < res.meter.value ? "is-on" : ""} />
            ))}
          </div>
          <p className="meter__label">{res.meter.label}</p>
        </div>
      )}
      {res.stats && (
        <dl className="stats">
          {res.stats.map((s) => (
            <div key={s.label} className={`stats__item ${s.warn ? "is-warn" : ""}`}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {res.checks && <Checks items={res.checks} />}
      {res.tables && res.tables.map((t, i) => <DataTable key={i} table={t} open />)}
      {res.output !== undefined && (
        <div className="out">
          <div className="io__bar">
            <span className="field__label">Output</span>
            <div className="io__tools">
              <CopyButton text={res.output} />
              {res.download && <DownloadButton text={res.output} {...res.download} />}
            </div>
          </div>
          <textarea className="input textarea textarea--out" readOnly value={res.output} rows={cfg.noInput ? 10 : 12} spellCheck="false" aria-label="Output" />
        </div>
      )}
      {res.outputs && (
        <ul className="outs">
          {res.outputs.map((o) => (
            <li key={o.label} className="outs__item">
              <div className="outs__head">
                <span className="outs__label">{o.label}</span>
                <CopyButton text={o.value} />
              </div>
              <pre className="outs__value">{o.value}</pre>
            </li>
          ))}
        </ul>
      )}
      {res.highlight !== undefined && <pre className="hl" dangerouslySetInnerHTML={{ __html: res.highlight }} />}
      {res.html !== undefined && (
        <div className="preview">
          <span className="field__label">Preview</span>
          <iframe className="preview__frame" sandbox="" title="Rendered preview" style={res.htmlHeight ? { height: res.htmlHeight } : undefined} srcDoc={`<!doctype html><meta charset="utf-8"><style>body{font:16px/1.6 system-ui,sans-serif;margin:16px;color:#13203b}table{border-collapse:collapse}td,th{border:1px solid #ccd;padding:4px 8px}img{max-width:100%}</style>${res.html}`} />
        </div>
      )}
      {res.table && <DataTable table={res.table} open />}
    </>
  );
}
