import { useState } from "react";
import { Table2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function HtmlTableGenerator() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [out, setOut] = useState("");
  const gen = () => {
    let h = "<table>\n";
    for (let r = 0; r < rows; r++) h += "  <tr>" + Array.from({ length: cols }, (_, c) => "<td>R" + (r + 1) + "C" + (c + 1) + "</td>").join("") + "</tr>\n";
    setOut(h + "</table>");
  };
  return (
    <>
      <Seo page="htmlTableGenerator" />
      <ToolHeroShell category="html-tools" icon={Table2} title="HTML Table Generator" subtitle="Generate HTML tables." layout="stack" panel="light">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Rows<input type="number" className={inputDark + " mt-1.5"} value={rows} onChange={(e) => setRows(+e.target.value)} /></label>
          <label className="text-sm">Cols<input type="number" className={inputDark + " mt-1.5"} value={cols} onChange={(e) => setCols(+e.target.value)} /></label>
        </div>
        <button type="button" onClick={gen} className="mt-3 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white">Generate</button>
        <textarea className={textareaDark + " mt-4 min-h-[180px]"} value={out} readOnly />
      </ToolHeroShell>
      <ToolContentLayout category="html-tools" currentToolPath="/html-tools/html-table-generator" />
    </>
  );
}
