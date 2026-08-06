import { KeyRound } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CsrGenerator() {
  return (
    <IoToolShell
      seoKey="csrGenerator"
      category="security-tools"
      path="/security-tools/csr-generator"
      icon={KeyRound}
      title="CSR Generator"
      subtitle="Build OpenSSL CSR commands."
      actionLabel="Run"
      transform={transforms.csr}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
