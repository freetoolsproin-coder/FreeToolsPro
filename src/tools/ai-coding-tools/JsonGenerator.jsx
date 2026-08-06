import { Braces } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function JsonGenerator() {
  return (
    <IoToolShell
      seoKey="jsonGenerator"
      category="ai-coding-tools"
      path="/ai-coding-tools/json-generator"
      icon={Braces}
      title="JSON Generator"
      subtitle="Generate sample JSON objects from field names."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.json_gen}
    />
  );
}
