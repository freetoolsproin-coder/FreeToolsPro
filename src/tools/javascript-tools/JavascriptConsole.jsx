import { useState } from "react";
import { Code2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function JavascriptConsole() {
  const [code, setCode] = useState("1 + 2 * 3");
  const [out, setOut] = useState("");
  const run = () => {
    const logs = [];
    const fake = { log: (...a) => logs.push(a.map(String).join(" ")) };
    try {
      const fn = new Function("console", "return (" + code + ")");
      const result = fn(fake);
      setOut([...logs, result !== undefined ? "⇒ " + String(result) : ""].filter(Boolean).join("\n") || "(no output)");
    } catch (e) {
      setOut(String(e.message || e));
    }
  };
  return (
    <>
      <Seo page="javascriptConsole" />
      <ToolHeroShell category="javascript-tools" icon={Code2} title="JavaScript Console" subtitle="Evaluate expressions in a mini console." layout="stack" panel="light">
        <textarea className={textareaDark + " min-h-[180px] font-mono"} value={code} onChange={(e) => setCode(e.target.value)} />
        <button type="button" onClick={run} className="mt-3 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white">Run</button>
        <pre className="mt-4 overflow-auto rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4 text-sm">{out}</pre>
      </ToolHeroShell>
      <ToolContentLayout category="javascript-tools" currentToolPath="/javascript-tools/javascript-console" />
    </>
  );
}
