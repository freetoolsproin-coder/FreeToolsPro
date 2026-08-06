import { Braces } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function JsonCleaner() {
  return (
    <IoToolShell
      seoKey="jsonCleaner"
      category="ai-data-tools"
      path="/ai-data-tools/json-cleaner"
      icon={Braces}
      title="JSON Cleaner"
      subtitle="Pretty-print and validate JSON."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.json_clean}
    />
  );
}
