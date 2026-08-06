import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlEscape() {
  return (
    <IoToolShell
      seoKey="htmlEscape"
      category="html-tools"
      path="/html-tools/html-escape"
      icon={Code2}
      title="HTML Escape"
      subtitle="Escape HTML special characters."
      actionLabel="Run"
      transform={transforms.html_escape}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
