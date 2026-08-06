import { useState } from "react";
import { GitCompare } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function flatten(obj, prefix = "") {
  if (obj === null || typeof obj !== "object") return { [prefix || "(root)"]: obj };
  return Object.entries(obj).reduce((acc, [k, v]) => Object.assign(acc, flatten(v, prefix ? prefix + "." + k : k)), {});
}

export default function JsonCompare() {
  const [a, setA] = useState('{"name":"Ada","role":"admin"}');
  const [b, setB] = useState('{"name":"Ada","role":"editor"}');
  const [diff, setDiff] = useState([]);
  const run = () => {
    try {
      const left = flatten(JSON.parse(a));
      const right = flatten(JSON.parse(b));
      const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
      setDiff([...keys].map((k) => ({
        key: k,
        left: left[k] === undefined ? "∅" : JSON.stringify(left[k]),
        right: right[k] === undefined ? "∅" : JSON.stringify(right[k]),
        same: JSON.stringify(left[k]) === JSON.stringify(right[k]),
      })));
    } catch (e) {
      setDiff([{ key: "error", left: e.message, right: "", same: false }]);
    }
  };
  return (
    <>
      <Seo page="jsonCompare" />
      <ToolHeroShell category="json-tools" icon={GitCompare} title="JSON Compare" subtitle="Compare two JSON documents." layout="stack" panel="light">
        <div className="grid gap-4 lg:grid-cols-2">
          <textarea className={textareaDark + " min-h-[180px]"} value={a} onChange={(e) => setA(e.target.value)} />
          <textarea className={textareaDark + " min-h-[180px]"} value={b} onChange={(e) => setB(e.target.value)} />
        </div>
        <button type="button" onClick={run} className="mt-4 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white">Compare</button>
        <ul className="mt-4 space-y-2">
          {diff.map((row) => (
            <li key={row.key} className={"rounded-xl border px-3 py-2 text-sm " + (row.same ? "border-[var(--ftp-line)] bg-white" : "border-amber-200 bg-amber-50")}>
              <span className="font-semibold">{row.key}</span>
              <div className="mt-1 grid gap-1 text-[var(--ftp-ink-soft)] sm:grid-cols-2"><span>A: {row.left}</span><span>B: {row.right}</span></div>
            </li>
          ))}
        </ul>
      </ToolHeroShell>
      <ToolContentLayout category="json-tools" currentToolPath="/json-tools/json-compare" />
    </>
  );
}
