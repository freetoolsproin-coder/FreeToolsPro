import { FileText } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function PdfToolPage({ title, subtitle, path, children }) {
  return <>
    <Seo page="pdfConverter" />
    <ToolHeroShell category="pdf-tools" icon={FileText} title={title} subtitle={subtitle} formLabel={title} layout="stack" wide>
      <div className="rounded-2xl border border-[var(--ftp-line)] bg-white p-4 sm:p-6">{children}</div>
    </ToolHeroShell>
    <ToolContentLayout category="pdf-tools" currentToolPath={path} />
  </>;
}
