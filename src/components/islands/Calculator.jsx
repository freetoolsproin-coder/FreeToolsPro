import { useEffect, useMemo, useState } from "react";
import { CALCS } from "../../tools/calcs.js";
import { Field, Readout, DataTable, CopyButton } from "./ui.jsx";

function todayIso() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function Calculator({ id }) {
  const cfg = CALCS[id];
  const [v, setV] = useState(() => Object.fromEntries(cfg.inputs.map((i) => [i.id, i.def === "today" ? "" : i.def])));

  // After hydration: fill "today" dates and apply values shared via the URL (?P=500000&r=8.5).
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setV((prev) => {
      const next = { ...prev };
      for (const i of cfg.inputs) {
        if (i.def === "today" && !next[i.id]) next[i.id] = todayIso();
        if (q.has(i.id)) {
          const raw = q.get(i.id);
          if (i.type === "toggle") next[i.id] = raw === "1";
          else if (["money", "percent", "years", "number"].includes(i.type)) {
            const n = Number(raw);
            if (Number.isFinite(n)) next[i.id] = n;
          } else if (i.type !== "select" || i.options.some(([o]) => String(o) === raw)) next[i.id] = raw;
        }
      }
      return next;
    });
  }, [id]);

  const result = useMemo(() => {
    try {
      return cfg.compute(v);
    } catch (e) {
      return { error: "Check the values you entered." };
    }
  }, [v, id]);

  const set = (k) => (val) => setV((p) => ({ ...p, [k]: val }));
  const shareUrl = () => {
    const q = new URLSearchParams();
    for (const i of cfg.inputs) if (!i.show || i.show(v)) q.set(i.id, i.type === "toggle" ? (v[i.id] ? "1" : "0") : v[i.id]);
    return `${location.origin}${location.pathname}?${q}`;
  };

  return (
    <div className="calc">
      <form className="calc__inputs panel" onSubmit={(e) => e.preventDefault()} aria-label="Inputs">
        {cfg.inputs.map((i) => (!i.show || i.show(v) ? <Field key={i.id} spec={i} value={v[i.id]} onChange={set(i.id)} /> : null))}
        <div className="calc__actions">
          <CopyButton text={shareUrl} label="Copy link with these values" />
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setV(Object.fromEntries(cfg.inputs.map((i) => [i.id, i.def === "today" ? todayIso() : i.def])))}>
            Reset
          </button>
        </div>
      </form>
      <div className="calc__result">
        <Readout {...result} />
        {!result.error && <DataTable table={result.table} />}
      </div>
    </div>
  );
}
