import { BadgeCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function UuidValidator() {
  return (
    <IoToolShell
      seoKey="uuidValidator"
      category="hash-tools"
      path="/hash-tools/uuid-validator"
      icon={BadgeCheck}
      title="UUID Validator"
      subtitle="Validate UUID format."
      actionLabel="Run"
      transform={transforms.uuid_val}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
