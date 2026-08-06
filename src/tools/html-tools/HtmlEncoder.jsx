import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlEncoder() {
  return (
    <IoToolShell
      seoKey="htmlEncoder"
      category="html-tools"
      path="/html-tools/html-encoder"
      icon={Code2}
      title="HTML Encoder"
      subtitle="Encode text as HTML entities."
      actionLabel="Run"
      transform={transforms.html_escape}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
