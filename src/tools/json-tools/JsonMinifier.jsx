import { Minimize2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonMinifier() {
  return (
    <IoToolShell
      seoKey="jsonMinifier"
      category="json-tools"
      path="/json-tools/json-minifier"
      icon={Minimize2}
      title="JSON Minifier"
      subtitle="Minify JSON by removing whitespace."
      actionLabel="Run"
      transform={transforms.json_minify}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
