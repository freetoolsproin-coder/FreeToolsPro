import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonToTypescript() {
  return (
    <IoToolShell
      seoKey="jsonToTypescript"
      category="json-tools"
      path="/json-tools/json-to-typescript"
      icon={FileCode2}
      title="JSON to TypeScript"
      subtitle="Generate TypeScript interfaces from JSON."
      actionLabel="Run"
      transform={transforms.json_to_ts}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
