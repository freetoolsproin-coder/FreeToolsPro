import { FileText } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlToMarkdown() {
  return (
    <IoToolShell
      seoKey="htmlToMarkdown"
      category="html-tools"
      path="/html-tools/html-to-markdown"
      icon={FileText}
      title="HTML to Markdown"
      subtitle="Convert HTML to Markdown."
      actionLabel="Run"
      transform={transforms.html_to_md}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
