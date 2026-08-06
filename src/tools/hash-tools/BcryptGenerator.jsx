import { Lock } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function BcryptGenerator() {
  return (
    <IoToolShell
      seoKey="bcryptGenerator"
      category="hash-tools"
      path="/hash-tools/bcrypt-generator"
      icon={Lock}
      title="BCrypt Generator"
      subtitle="Hash passwords with bcrypt."
      actionLabel="Run"
      transform={transforms.bcrypt}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
