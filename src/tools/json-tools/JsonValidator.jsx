import { Braces } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonValidator() {
  return (
    <IoToolShell
      seoKey="jsonValidator"
      category="json-tools"
      path="/json-tools/json-validator"
      icon={Braces}
      title="JSON Validator"
      subtitle="Validate JSON and show parse errors."
      actionLabel="Run"
      transform={transforms.json_validate}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
