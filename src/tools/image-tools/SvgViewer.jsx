import { useState } from "react";
import { Image } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function SvgViewer() {
  const [code, setCode] = useState("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><circle cx=\"60\" cy=\"60\" r=\"50\" fill=\"#0f766e\" /></svg>");
  return (
    <>
      <Seo page="svgViewer" />
      <ToolHeroShell category="image-tools" icon={Image} title="SVG Viewer" subtitle="Preview SVG markup." layout="stack" panel="light">
        <textarea className={textareaDark + " min-h-[180px]"} value={code} onChange={(e) => setCode(e.target.value)} />
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--ftp-line)] bg-white">
          <iframe title="preview" sandbox="" className="h-72 w-full" srcDoc={code} />
        </div>
      </ToolHeroShell>
      <ToolContentLayout category="image-tools" currentToolPath="/image-tools/svg-viewer" />
    </>
  );
}
