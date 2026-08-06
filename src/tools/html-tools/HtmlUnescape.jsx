import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlUnescape() {
  return (
    <IoToolShell
      seoKey="htmlUnescape"
      category="html-tools"
      path="/html-tools/html-unescape"
      icon={Code2}
      title="HTML Unescape"
      subtitle="Unescape HTML entities."
      actionLabel="Run"
      transform={transforms.html_unescape}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
