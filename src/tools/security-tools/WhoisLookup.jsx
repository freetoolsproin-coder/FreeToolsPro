import { Search } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function WhoisLookup() {
  return (
    <IoToolShell
      seoKey="whoisLookup"
      category="security-tools"
      path="/security-tools/whois-lookup"
      icon={Search}
      title="WHOIS Lookup"
      subtitle="RDAP domain registration lookup."
      actionLabel="Run"
      transform={transforms.whois}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
