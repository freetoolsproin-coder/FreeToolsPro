import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JwtGenerator() {
  return (
    <IoToolShell
      seoKey="jwtGenerator"
      category="jwt-tools"
      path="/jwt-tools/jwt-generator"
      icon={Sparkles}
      title="JWT Generator"
      subtitle="Generate sample JWTs for testing."
      actionLabel="Run"
      transform={transforms.jwt_gen}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
