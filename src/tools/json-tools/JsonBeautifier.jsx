import { Braces } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonBeautifier() {
  return (
    <IoToolShell
      seoKey="jsonBeautifier"
      category="json-tools"
      path="/json-tools/json-beautifier"
      icon={Braces}
      title="JSON Beautifier"
      subtitle="Beautify JSON with indentation."
      actionLabel="Run"
      transform={transforms.json_pretty}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
