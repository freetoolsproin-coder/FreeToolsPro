import { ClipboardList } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function SopGenerator() {
  return (
    <IoToolShell
      seoKey="sopGenerator"
      category="ai-automation-tools"
      path="/ai-automation-tools/sop-generator"
      icon={ClipboardList}
      title="SOP Generator"
      subtitle="Generate a standard operating procedure outline."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.sop_gen}
    />
  );
}
