import { useState } from "react";
import { Monitor } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function HtmlPreview() {
  const [code, setCode] = useState("<h1>Hello</h1><p>Preview HTML here.</p>");
  return (
    <>
      <Seo page="htmlPreview" />
      <ToolHeroShell category="html-tools" icon={Monitor} title="HTML Preview" subtitle="Preview HTML in a sandboxed view." layout="stack" panel="light">
        <textarea className={textareaDark + " min-h-[180px]"} value={code} onChange={(e) => setCode(e.target.value)} />
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--ftp-line)] bg-white">
          <iframe title="preview" sandbox="" className="h-72 w-full" srcDoc={code} />
        </div>
      </ToolHeroShell>
      <ToolContentLayout category="html-tools" currentToolPath="/html-tools/html-preview" />
    </>
  );
}
