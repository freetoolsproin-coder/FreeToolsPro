import { ShieldCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function PasswordStrengthChecker() {
  return (
    <IoToolShell
      seoKey="passwordStrengthChecker"
      category="security-tools"
      path="/security-tools/password-strength-checker"
      icon={ShieldCheck}
      title="Password Strength Checker"
      subtitle="Score password strength."
      actionLabel="Run"
      transform={transforms.pwd_strength}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
