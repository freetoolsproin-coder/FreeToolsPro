import { useMemo, useState } from "react";
import { Network } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function Node({ name, value, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = value !== null && typeof value === "object";
  if (!isObj) return <div style={{ paddingLeft: depth * 14 }} className="font-mono text-sm"><span className="text-teal-700">{name}</span>: {JSON.stringify(value)}</div>;
  const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v]) : Object.entries(value);
  return (
    <div style={{ paddingLeft: depth * 14 }}>
      <button type="button" onClick={() => setOpen(!open)} className="font-mono text-sm font-semibold">{open ? "▼" : "▶"} {name}</button>
      {open ? entries.map(([k, v]) => <Node key={k} name={k} value={v} depth={depth + 1} />) : null}
    </div>
  );
}

export default function JsonTreeViewer() {
  const [input, setInput] = useState('{"user":{"id":1,"tags":["a","b"]}}');
  const tree = useMemo(() => { try { return JSON.parse(input); } catch { return null; } }, [input]);
  return (
    <>
      <Seo page="jsonTreeViewer" />
      <ToolHeroShell category="json-tools" icon={Network} title="JSON Tree Viewer" subtitle="Explore JSON as an expandable tree." layout="stack" panel="light">
        <textarea className={textareaDark + " min-h-[160px]"} value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="mt-4 rounded-xl border border-[var(--ftp-line)] bg-white p-4">{tree ? <Node name="root" value={tree} /> : <p className="text-sm text-rose-600">Invalid JSON</p>}</div>
      </ToolHeroShell>
      <ToolContentLayout category="json-tools" currentToolPath="/json-tools/json-tree-viewer" />
    </>
  );
}
