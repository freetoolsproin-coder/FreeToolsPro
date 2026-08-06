import { FileCheck2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonSchemaGenerator() {
  return (
    <IoToolShell
      seoKey="jsonSchemaGenerator"
      category="json-tools"
      path="/json-tools/json-schema-generator"
      icon={FileCheck2}
      title="JSON Schema Generator"
      subtitle="Infer JSON Schema from sample JSON."
      actionLabel="Run"
      transform={transforms.json_schema}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
