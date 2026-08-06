import { Mail } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function SpfChecker() {
  return (
    <IoToolShell
      seoKey="spfChecker"
      category="security-tools"
      path="/security-tools/spf-checker"
      icon={Mail}
      title="SPF Checker"
      subtitle="Inspect SPF TXT records."
      actionLabel="Run"
      transform={transforms.spf}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
