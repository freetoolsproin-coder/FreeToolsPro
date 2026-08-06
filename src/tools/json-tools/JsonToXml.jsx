import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonToXml() {
  return (
    <IoToolShell
      seoKey="jsonToXml"
      category="json-tools"
      path="/json-tools/json-to-xml"
      icon={FileCode2}
      title="JSON to XML"
      subtitle="Convert JSON objects into XML."
      actionLabel="Run"
      transform={transforms.json_to_xml}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
