import { ShieldCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function Sha256Generator() {
  return (
    <IoToolShell
      seoKey="sha256Generator"
      category="hash-tools"
      path="/hash-tools/sha256-generator"
      icon={ShieldCheck}
      title="SHA256 Generator"
      subtitle="Generate SHA-256 hashes."
      actionLabel="Run"
      transform={transforms.sha256}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
