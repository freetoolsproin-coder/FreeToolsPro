import { KeyRound } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JwtEncoder() {
  return (
    <IoToolShell
      seoKey="jwtEncoder"
      category="jwt-tools"
      path="/jwt-tools/jwt-encoder"
      icon={KeyRound}
      title="JWT Encoder"
      subtitle="Encode header/payload into an unsigned JWT."
      actionLabel="Run"
      transform={transforms.jwt_encode}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
