import { Bot } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function ApiMockGenerator() {
  return (
    <IoToolShell
      seoKey="apiMockGenerator"
      category="api-tools"
      path="/api-tools/api-mock-generator"
      icon={Bot}
      title="API Mock Generator"
      subtitle="Generate mock JSON from field names."
      actionLabel="Run"
      transform={transforms.api_mock}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
