import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlEncode() {
  return (
    <IoToolShell
      seoKey="htmlEncode"
      category="encoding-tools"
      path="/encoding-tools/html-encode"
      icon={Code2}
      title="HTML Encode"
      subtitle="Encode HTML entities."
      actionLabel="Run"
      transform={transforms.html_escape}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
