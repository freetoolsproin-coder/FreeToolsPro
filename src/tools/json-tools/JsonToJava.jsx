import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonToJava() {
  return (
    <IoToolShell
      seoKey="jsonToJava"
      category="json-tools"
      path="/json-tools/json-to-java"
      icon={FileCode2}
      title="JSON to Java"
      subtitle="Generate Java class stubs from JSON."
      actionLabel="Run"
      transform={transforms.json_to_java}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
