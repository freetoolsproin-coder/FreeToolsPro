import { Mail } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function DmarcChecker() {
  return (
    <IoToolShell
      seoKey="dmarcChecker"
      category="security-tools"
      path="/security-tools/dmarc-checker"
      icon={Mail}
      title="DMARC Checker"
      subtitle="Inspect DMARC policies."
      actionLabel="Run"
      transform={transforms.dmarc}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
