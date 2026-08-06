import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonToCsharp() {
  return (
    <IoToolShell
      seoKey="jsonToCsharp"
      category="json-tools"
      path="/json-tools/json-to-csharp"
      icon={FileCode2}
      title="JSON to C#"
      subtitle="Generate C# class stubs from JSON."
      actionLabel="Run"
      transform={transforms.json_to_csharp}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
