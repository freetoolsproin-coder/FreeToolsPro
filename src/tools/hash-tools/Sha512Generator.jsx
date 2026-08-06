import { ShieldCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function Sha512Generator() {
  return (
    <IoToolShell
      seoKey="sha512Generator"
      category="hash-tools"
      path="/hash-tools/sha512-generator"
      icon={ShieldCheck}
      title="SHA512 Generator"
      subtitle="Generate SHA-512 hashes."
      actionLabel="Run"
      transform={transforms.sha512}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
