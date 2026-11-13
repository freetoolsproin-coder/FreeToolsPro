import { useEffect, useId, useRef, useState } from "react";
import { fmt, inWords } from "../../lib/format.js";

/** Copy-to-clipboard button whose label confirms the action. */
export function CopyButton({ text, label = "Copy", className = "" }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(typeof text === "function" ? text() : text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = typeof text === "function" ? text() : text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  }
  return (
    <button type="button" className={`btn btn--ghost btn--sm ${className}`} onClick={copy} aria-live="polite">
      {done ? "Copied" : label}
    </button>
  );
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function DownloadButton({ text, name, mime = "text/plain", bom = false, label = "Download" }) {
  return (
    <button
      type="button"
      className="btn btn--ghost btn--sm"
      onClick={() => downloadBlob(new Blob([bom ? "﻿" : "", typeof text === "function" ? text() : text], { type: `${mime};charset=utf-8` }), name)}
    >
      {label}
    </button>
  );
}

/** Text input that shows Indian digit grouping when not focused. */
export function NumberInput({ id, value, onChange, min, max, step, unit, prefix, ariaLabel }) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(String(value));
  useEffect(() => {
    if (!focused) setDraft(String(value));
  }, [value, focused]);
  const shown = focused ? draft : Number.isFinite(value) ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 }).format(value) : "";
  return (
    <div className="num">
      {prefix && <span className="num__affix">{prefix}</span>}
      <input
        id={id}
        className="input num__input"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        aria-label={ariaLabel}
        value={shown}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          let n = parseFloat(draft.replace(/,/g, ""));
          if (!Number.isFinite(n)) n = min ?? 0;
          if (min !== undefined && n < min) n = min;
          if (max !== undefined && n > max) n = max;
          onChange(n);
        }}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.\-]/g, "");
          setDraft(raw);
          const n = parseFloat(raw);
          if (Number.isFinite(n)) onChange(n);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const n = (Number(value) || 0) + (e.key === "ArrowUp" ? 1 : -1) * (step || 1);
            const c = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, +n.toFixed(6)));
            setDraft(String(c));
            onChange(c);
          }
        }}
      />
      {unit && <span className="num__affix num__affix--end">{unit}</span>}
    </div>
  );
}

/** One labelled field. Renders the right control for `spec.type`. */
export function Field({ spec, value, onChange }) {
  const id = useId();
  const { type, label } = spec;
  if (type === "toggle") {
    return (
      <label className="toggle" htmlFor={id}>
        <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle__track" aria-hidden="true" />
        <span>{label}</span>
      </label>
    );
  }
  let control;
  if (type === "select") {
    const opts = spec.options;
    if (opts.length <= 3 && opts.every(([, l]) => l.length <= 26)) {
      control = (
        <div className="seg" role="radiogroup" aria-labelledby={id + "l"}>
          {opts.map(([v, l]) => (
            <button key={v} type="button" role="radio" aria-checked={String(value) === String(v)} className="seg__opt" onClick={() => onChange(v)}>
              {l}
            </button>
          ))}
        </div>
      );
    } else {
      control = (
        <select id={id} className="input select" value={value} onChange={(e) => onChange(e.target.value)}>
          {opts.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      );
    }
  } else if (["money", "percent", "years", "number"].includes(type)) {
    const unit = type === "percent" ? "%" : type === "years" ? (value === 1 ? "year" : "years") : spec.unit;
    const prefix = type === "money" ? "₹" : undefined;
    const slider = spec.min !== undefined && spec.max !== undefined && spec.max - spec.min > 0 && spec.max < 1e11 && type !== "number";
    control = (
      <>
        <NumberInput id={id} value={value} onChange={onChange} min={spec.min} max={spec.max} step={spec.step} unit={unit} prefix={prefix} />
        {slider && (
          <input
            className="range"
            type="range"
            aria-label={`${label} slider`}
            min={spec.min}
            max={spec.max}
            step={spec.step}
            value={Math.min(spec.max, Math.max(spec.min, value))}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ "--p": `${((Math.min(spec.max, Math.max(spec.min, value)) - spec.min) / (spec.max - spec.min)) * 100}%` }}
          />
        )}
        {type === "money" && value >= 100000 && <span className="field__hint">{inWords(value)}</span>}
      </>
    );
  } else if (type === "range") {
    control = (
      <div className="rangebox">
        <input
          id={id}
          className="range"
          type="range"
          min={spec.min}
          max={spec.max}
          step={spec.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ "--p": `${((value - spec.min) / (spec.max - spec.min)) * 100}%` }}
        />
        <output htmlFor={id} className="rangebox__val">
          {value}
          {spec.unit}
        </output>
      </div>
    );
  } else if (type === "date") {
    control = <input id={id} className="input" type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
  } else if (type === "time") {
    control = <input id={id} className="input" type="time" value={value} onChange={(e) => onChange(e.target.value)} />;
  } else if (type === "color") {
    control = (
      <div className="colorbox">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} />
        <input className="input" type="text" value={value} spellCheck="false" aria-label={`${label} hex value`} onChange={(e) => /^#[0-9a-f]{6}$/i.test(e.target.value) && onChange(e.target.value)} />
      </div>
    );
  } else if (type === "textarea") {
    control = <textarea id={id} className="input textarea textarea--sm" rows={spec.rows || 3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={spec.placeholder} />;
  } else {
    control = <input id={id} className="input" type="text" value={value} placeholder={spec.placeholder} spellCheck="false" onChange={(e) => onChange(e.target.value)} />;
  }
  const count = spec.counter ? [...String(value)].length : null;
  return (
    <div className="field">
      <label className="field__label" id={id + "l"} htmlFor={type === "select" && spec.options.length <= 3 ? undefined : id}>
        <span>{label}</span>
        {count !== null && (
          <span className={`field__count ${count > spec.counter[1] ? "is-over" : count < spec.counter[0] ? "is-under" : ""}`}>
            {count}/{spec.counter[1]}
          </span>
        )}
      </label>
      {control}
    </div>
  );
}

/** The marigold result block: the one loud element on a tool page. */
export function Readout({ primary, rows, split, note, error, children }) {
  if (error)
    return (
      <div className="readout readout--error" role="status">
        <p className="readout__msg">{error}</p>
      </div>
    );
  const words = primary && primary.fmt === "inr" && Math.abs(primary.value) >= 100000 ? inWords(primary.value) : "";
  return (
    <div className="readout" role="status" aria-live="polite">
      {primary && (
        <div className="readout__head">
          <p className="readout__label">{primary.label}</p>
          <p className={`readout__value ${String(fmt(primary.value, primary.fmt)).length > 16 ? "readout__value--long" : ""}`}>{fmt(primary.value, primary.fmt)}</p>
          {(primary.sub || words) && <p className="readout__sub">{primary.sub || words}</p>}
        </div>
      )}
      {split && <SplitBar parts={split} />}
      {rows && rows.length > 0 && (
        <dl className="rows">
          {rows.map((r) => (
            <div key={r.label} className={`rows__row ${r.strong ? "is-strong" : ""}`}>
              <dt>{r.label}</dt>
              <dd>{fmt(r.value, r.fmt)}</dd>
            </div>
          ))}
        </dl>
      )}
      {children}
      {note && <p className="readout__note">{note}</p>}
    </div>
  );
}

const CHECK_ICON = { ok: "✓", warn: "!", bad: "✕", info: "i" };
const CHECK_WORD = { ok: "Pass", warn: "Warning", bad: "Problem", info: "Note" };

/** A list of pass / warning / problem lines, used by the SEO and writing checkers. */
export function Checks({ items }) {
  if (!items || !items.length) return null;
  return (
    <ul className="checks">
      {items.map((c, i) => (
        <li key={i} className={`checks__item is-${c.status}`}>
          <span className="checks__icon" aria-hidden="true">
            {CHECK_ICON[c.status] || "•"}
          </span>
          <div className="checks__body">
            <p className="checks__label">
              <span className="visually-hidden">{CHECK_WORD[c.status]}: </span>
              {c.label}
            </p>
            {c.detail && <p className="checks__detail">{c.detail}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SplitBar({ parts }) {
  const total = parts.reduce((a, p) => a + Math.max(0, p.value), 0) || 1;
  return (
    <div className="split">
      <div className="split__bar" aria-hidden="true">
        {parts.map((p, i) => (
          <span key={p.label} className={`split__seg split__seg--${i}`} style={{ width: `${(Math.max(0, p.value) / total) * 100}%` }} />
        ))}
      </div>
      <ul className="split__legend">
        {parts.map((p, i) => (
          <li key={p.label}>
            <span className={`split__dot split__seg--${i}`} aria-hidden="true" />
            {p.label} <b>{Math.round((Math.max(0, p.value) / total) * 100)}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DataTable({ table, open = false }) {
  if (!table) return null;
  const body = (
    <div className="table-wrap" tabIndex={0}>
      <table className="table">
        <thead>
          <tr>
            {table.cols.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className={table.fmts && table.fmts[j] !== "text" ? "num-cell" : ""}>
                  {table.fmts ? fmt(cell, table.fmts[j]) : String(cell ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  if (!table.title) return body;
  return (
    <details className="disclose" open={open}>
      <summary>{table.title}</summary>
      {body}
    </details>
  );
}

/** Drag-and-drop file picker. */
export function DropZone({ accept, multiple, onFiles, label, hint }) {
  const ref = useRef(null);
  const [over, setOver] = useState(false);
  return (
    <div
      className={`drop ${over ? "is-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = [...e.dataTransfer.files];
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="visually-hidden"
        onChange={(e) => {
          const files = [...e.target.files];
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
      <button type="button" className="btn btn--primary" onClick={() => ref.current.click()}>
        {label}
      </button>
      <p className="drop__hint">{hint}</p>
    </div>
  );
}

export function useDebounced(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
