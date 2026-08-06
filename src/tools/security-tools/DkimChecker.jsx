import { Mail } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function DkimChecker() {
  return (
    <IoToolShell
      seoKey="dkimChecker"
      category="security-tools"
      path="/security-tools/dkim-checker"
      icon={Mail}
      title="DKIM Checker"
      subtitle="Lookup DKIM selector records."
      actionLabel="Run"
      transform={transforms.dkim}
      multiline={true}
      placeholder="selector\\nexample.com"
    />
  );
}
