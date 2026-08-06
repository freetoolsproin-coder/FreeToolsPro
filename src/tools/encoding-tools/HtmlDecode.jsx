import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlDecode() {
  return (
    <IoToolShell
      seoKey="htmlDecode"
      category="encoding-tools"
      path="/encoding-tools/html-decode"
      icon={Code2}
      title="HTML Decode"
      subtitle="Decode HTML entities."
      actionLabel="Run"
      transform={transforms.html_unescape}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
