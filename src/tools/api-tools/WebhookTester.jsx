import { Network } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function WebhookTester() {
  return (
    <IoToolShell
      seoKey="webhookTester"
      category="api-tools"
      path="/api-tools/webhook-tester"
      icon={Network}
      title="Webhook Tester"
      subtitle="Craft webhook payloads and sample signatures."
      actionLabel="Run"
      transform={transforms.webhook}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
