import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function UuidGenerator() {
  return (
    <IoToolShell
      seoKey="uuidGenerator"
      category="hash-tools"
      path="/hash-tools/uuid-generator"
      icon={Sparkles}
      title="UUID Generator"
      subtitle="Generate UUID v4 values."
      actionLabel="Run"
      transform={transforms.uuid_gen}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
