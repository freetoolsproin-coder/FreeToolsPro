import { useState } from "react";
import { PlayCircle } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function JavascriptPlayground() {
  const [code, setCode] = useState("const n = [1,2,3].map(x => x * 2);\\nconsole.log(n);\\nn;");
  const [out, setOut] = useState("");
  const run = () => {
    const logs = [];
    const fake = { log: (...a) => logs.push(a.map(String).join(" ")) };
    try {
      const fn = new Function("console", code);
      const result = fn(fake);
      setOut([...logs, result !== undefined ? "⇒ " + String(result) : ""].filter(Boolean).join("\n") || "(no output)");
    } catch (e) {
      setOut(String(e.message || e));
    }
  };
  return (
    <>
      <Seo page="javascriptPlayground" />
      <ToolHeroShell category="javascript-tools" icon={PlayCircle} title="JavaScript Playground" subtitle="Run JS snippets and capture output." layout="stack" panel="light">
        <textarea className={textareaDark + " min-h-[180px] font-mono"} value={code} onChange={(e) => setCode(e.target.value)} />
        <button type="button" onClick={run} className="mt-3 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white">Run</button>
        <pre className="mt-4 overflow-auto rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4 text-sm">{out}</pre>
      </ToolHeroShell>
      <ToolContentLayout category="javascript-tools" currentToolPath="/javascript-tools/javascript-playground" />
    </>
  );
}
