import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonToDart() {
  return (
    <IoToolShell
      seoKey="jsonToDart"
      category="json-tools"
      path="/json-tools/json-to-dart"
      icon={FileCode2}
      title="JSON to Dart"
      subtitle="Generate Dart models from JSON."
      actionLabel="Run"
      transform={transforms.json_to_dart}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
