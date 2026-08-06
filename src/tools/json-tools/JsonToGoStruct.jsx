import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonToGoStruct() {
  return (
    <IoToolShell
      seoKey="jsonToGoStruct"
      category="json-tools"
      path="/json-tools/json-to-go-struct"
      icon={FileCode2}
      title="JSON to Go Struct"
      subtitle="Generate Go structs from JSON."
      actionLabel="Run"
      transform={transforms.json_to_go}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
