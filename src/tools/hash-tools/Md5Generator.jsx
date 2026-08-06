import { ShieldCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function Md5Generator() {
  return (
    <IoToolShell
      seoKey="md5Generator"
      category="hash-tools"
      path="/hash-tools/md5-generator"
      icon={ShieldCheck}
      title="MD5 Generator"
      subtitle="Generate MD5 hashes."
      actionLabel="Run"
      transform={transforms.md5}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
