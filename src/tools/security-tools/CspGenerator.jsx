import { ShieldCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CspGenerator() {
  return (
    <IoToolShell
      seoKey="cspGenerator"
      category="security-tools"
      path="/security-tools/csp-generator"
      icon={ShieldCheck}
      title="CSP Generator"
      subtitle="Generate Content-Security-Policy drafts."
      actionLabel="Run"
      transform={transforms.csp}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
