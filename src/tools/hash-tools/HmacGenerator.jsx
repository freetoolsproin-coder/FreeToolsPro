import { KeyRound } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HmacGenerator() {
  return (
    <IoToolShell
      seoKey="hmacGenerator"
      category="hash-tools"
      path="/hash-tools/hmac-generator"
      icon={KeyRound}
      title="HMAC Generator"
      subtitle="Generate HMAC-SHA256 signatures."
      actionLabel="Run"
      transform={transforms.hmac}
      multiline={true}
      placeholder="message\\n---\\nsecret"
    />
  );
}
