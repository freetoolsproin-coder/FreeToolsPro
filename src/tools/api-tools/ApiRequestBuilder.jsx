import { Network } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function ApiRequestBuilder() {
  return (
    <IoToolShell
      seoKey="apiRequestBuilder"
      category="api-tools"
      path="/api-tools/api-request-builder"
      icon={Network}
      title="API Request Builder"
      subtitle="Build REST request objects."
      actionLabel="Run"
      transform={transforms.api_builder}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
