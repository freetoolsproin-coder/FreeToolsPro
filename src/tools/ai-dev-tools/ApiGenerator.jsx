import { Network } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function ApiGenerator() {
  return (
    <IoToolShell
      seoKey="apiGenerator"
      category="ai-dev-tools"
      path="/ai-dev-tools/api-generator"
      icon={Network}
      title="API Generator"
      subtitle="Generate REST route stubs."
      actionLabel="Run"
      transform={transforms.api_gen}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
