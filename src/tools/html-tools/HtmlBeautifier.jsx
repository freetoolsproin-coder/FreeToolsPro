import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlBeautifier() {
  return (
    <IoToolShell
      seoKey="htmlBeautifier"
      category="html-tools"
      path="/html-tools/html-beautifier"
      icon={FileCode2}
      title="HTML Beautifier"
      subtitle="Beautify HTML markup."
      actionLabel="Run"
      transform={transforms.html_format}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
