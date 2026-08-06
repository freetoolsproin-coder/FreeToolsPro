import { Network } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ApiIntegrationAssistant() {
  return (
    <IoToolShell
      seoKey="apiIntegrationAssistant"
      category="ai-automation-tools"
      path="/ai-automation-tools/api-integration-assistant"
      icon={Network}
      title="API Integration Assistant"
      subtitle="Plan API auth, endpoints, and error handling."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.api_integration}
    />
  );
}
