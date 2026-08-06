import { Braces } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function XmlToJson() {
  return (
    <IoToolShell
      seoKey="xmlToJson"
      category="json-tools"
      path="/json-tools/xml-to-json"
      icon={Braces}
      title="XML to JSON"
      subtitle="Convert XML into JSON."
      actionLabel="Run"
      transform={transforms.xml_to_json}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
