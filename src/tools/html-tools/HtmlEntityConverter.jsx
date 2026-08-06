import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlEntityConverter() {
  return (
    <IoToolShell
      seoKey="htmlEntityConverter"
      category="html-tools"
      path="/html-tools/html-entity-converter"
      icon={Code2}
      title="HTML Entity Converter"
      subtitle="Convert characters to HTML entities."
      actionLabel="Run"
      transform={transforms.html_entity}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
