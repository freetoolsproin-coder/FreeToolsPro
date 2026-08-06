import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlFormatter() {
  return (
    <IoToolShell
      seoKey="htmlFormatter"
      category="html-tools"
      path="/html-tools/html-formatter"
      icon={FileCode2}
      title="HTML Formatter"
      subtitle="Format HTML with readable indentation."
      actionLabel="Run"
      transform={transforms.html_format}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
