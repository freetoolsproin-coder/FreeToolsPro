import { SearchCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JwtInspector() {
  return (
    <IoToolShell
      seoKey="jwtInspector"
      category="jwt-tools"
      path="/jwt-tools/jwt-inspector"
      icon={SearchCheck}
      title="JWT Inspector"
      subtitle="Inspect JWT header, payload, and signature."
      actionLabel="Run"
      transform={transforms.jwt_inspect}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
