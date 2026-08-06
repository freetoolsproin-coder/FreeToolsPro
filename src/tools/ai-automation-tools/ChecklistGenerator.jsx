import { ListChecks } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ChecklistGenerator() {
  return (
    <IoToolShell
      seoKey="checklistGenerator"
      category="ai-automation-tools"
      path="/ai-automation-tools/checklist-generator"
      icon={ListChecks}
      title="Checklist Generator"
      subtitle="Create an actionable checklist from a goal."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.checklist_gen}
    />
  );
}
