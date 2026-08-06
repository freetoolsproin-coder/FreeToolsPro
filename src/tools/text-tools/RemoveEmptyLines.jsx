import { Filter } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function RemoveEmptyLines() {
  return (
    <IoToolShell
      seoKey="removeEmptyLines"
      category="text-tools"
      path="/text-tools/remove-empty-lines"
      icon={Filter}
      title="Remove Empty Lines"
      subtitle="Strip blank lines from text."
      actionLabel="Run"
      transform={transforms.remove_empty}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
