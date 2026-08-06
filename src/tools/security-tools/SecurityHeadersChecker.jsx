import { ShieldCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function SecurityHeadersChecker() {
  return (
    <IoToolShell
      seoKey="securityHeadersChecker"
      category="security-tools"
      path="/security-tools/security-headers-checker"
      icon={ShieldCheck}
      title="Security Headers Checker"
      subtitle="Recommended HTTP security headers."
      actionLabel="Run"
      transform={transforms.sec_headers}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
