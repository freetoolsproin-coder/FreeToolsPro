import { Clock3 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JwtExpiryChecker() {
  return (
    <IoToolShell
      seoKey="jwtExpiryChecker"
      category="jwt-tools"
      path="/jwt-tools/jwt-expiry-checker"
      icon={Clock3}
      title="JWT Expiry Checker"
      subtitle="Check JWT exp claim status."
      actionLabel="Run"
      transform={transforms.jwt_expiry}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
