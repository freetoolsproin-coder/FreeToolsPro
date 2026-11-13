import { useMemo, useRef, useState } from "react";
import { SYMBOL_GROUPS } from "../../../tools/latex/symbols.js";
import { CopyButton } from "../ui.jsx";
import { Preview, Tex, insertAt, useEngine } from "./common.jsx";

function SymbolButton({ item, engine, onPick }) {
  const [cmd, name] = item;
  const [done, setDone] = useState(false);
  const pick = async () => {
    onPick(cmd);
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {}
    setDone(true);
    setTimeout(() => setDone(false), 900);
  };
  return (
    <li>
      <button type="button" className="ltx-sym" onClick={pick} title={`${name}: click to copy`}>
        <span className="ltx-sym__glyph">
          <Tex engine={engine} tex={cmd} display={false} label={name} />
        </span>
        <code className="ltx-sym__cmd">{done ? "Copied" : cmd}</code>
        <span className="ltx-sym__name">{name}</span>
      </button>
    </li>
  );
}

export default function SymbolGenerator() {
  const engine = useEngine();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [basket, setBasket] = useState("");
  const ref = useRef(null);

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    return SYMBOL_GROUPS.filter((g) => group === "all" || g.id === group)
      .map((g) => ({
        ...g,
        items: g.items.filter(([cmd, name, ch, extra]) => !s || cmd.toLowerCase().includes(s) || name.toLowerCase().includes(s) || (extra || "").toLowerCase().includes(s) || ch === q.trim()),
      }))
      .filter((g) => g.items.length);
  }, [q, group]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const add = (cmd) => insertAt(ref, basket, setBasket, /^\\[a-zA-Z]+$/.test(cmd) ? `${cmd} ` : cmd);

  return (
    <div className="ltx">
      <div className="panel ltx-pad">
        <div className="field">
          <label className="field__label" htmlFor="ltx-q">
            Find a symbol by name, command or character
          </label>
          <input id="ltx-q" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try: arrow, integral, not equal, or paste ≠" />
        </div>
        <div className="chips ltx-chips">
          {[{ id: "all", name: "All" }, ...SYMBOL_GROUPS].map((g) => (
            <button key={g.id} type="button" className={`chip chip--btn ${group === g.id ? "is-on" : ""}`} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
              {g.name}
            </button>
          ))}
        </div>
        <p className="hint" aria-live="polite">
          {total} {total === 1 ? "symbol" : "symbols"}. Click one to copy its command and add it below.
        </p>
      </div>
      <div className="panel ltx-pad">
        <div className="io__bar">
          <label className="field__label" htmlFor="ltx-basket">
            Build an expression
          </label>
          <div className="io__tools">
            <CopyButton text={() => basket} label="Copy" />
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setBasket("")} disabled={!basket}>
              Clear
            </button>
          </div>
        </div>
        <textarea id="ltx-basket" ref={ref} className="input textarea ltx-code" rows={2} value={basket} onChange={(e) => setBasket(e.target.value)} spellCheck="false" placeholder="Symbols you click appear here" />
        <Preview engine={engine} tex={basket} empty="Click symbols to build an expression." />
      </div>
      {groups.map((g) => (
        <section key={g.id} className="ltx-group">
          <h2 className="ltx-group__h">{g.name}</h2>
          <ul className="ltx-symgrid">
            {g.items.map((it) => (
              <SymbolButton key={it[0]} item={it} engine={engine} onPick={add} />
            ))}
          </ul>
        </section>
      ))}
      {!total && <p className="ltx-empty">No symbol matches “{q}”. Try a simpler word.</p>}
    </div>
  );
}
