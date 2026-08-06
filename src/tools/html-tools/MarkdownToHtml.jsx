import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function MarkdownToHtml() {
  return (
    <IoToolShell
      seoKey="markdownToHtml"
      category="html-tools"
      path="/html-tools/markdown-to-html"
      icon={FileCode2}
      title="Markdown to HTML"
      subtitle="Convert Markdown to HTML."
      actionLabel="Run"
      transform={transforms.md_to_html}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
