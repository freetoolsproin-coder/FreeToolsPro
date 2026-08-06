import { Braces } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonPrettyPrint() {
  return (
    <IoToolShell
      seoKey="jsonPrettyPrint"
      category="json-tools"
      path="/json-tools/json-pretty-print"
      icon={Braces}
      title="JSON Pretty Print"
      subtitle="Pretty-print JSON for debugging."
      actionLabel="Run"
      transform={transforms.json_pretty}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
