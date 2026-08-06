import { Globe } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CorsTester() {
  return (
    <IoToolShell
      seoKey="corsTester"
      category="security-tools"
      path="/security-tools/cors-tester"
      icon={Globe}
      title="CORS Tester"
      subtitle="Draft CORS response headers."
      actionLabel="Run"
      transform={transforms.cors}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
