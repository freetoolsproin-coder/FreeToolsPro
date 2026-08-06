import { Globe } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function DnsLookup() {
  return (
    <IoToolShell
      seoKey="dnsLookup"
      category="security-tools"
      path="/security-tools/dns-lookup"
      icon={Globe}
      title="DNS Lookup"
      subtitle="DNS-over-HTTPS A record lookup."
      actionLabel="Run"
      transform={transforms.dns}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
