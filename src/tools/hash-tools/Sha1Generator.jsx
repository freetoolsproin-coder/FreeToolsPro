import { ShieldCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function Sha1Generator() {
  return (
    <IoToolShell
      seoKey="sha1Generator"
      category="hash-tools"
      path="/hash-tools/sha1-generator"
      icon={ShieldCheck}
      title="SHA1 Generator"
      subtitle="Generate SHA-1 hashes."
      actionLabel="Run"
      transform={transforms.sha1}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
