import { Check } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function AiProofreader() {
  return (
    <IoToolShell
      seoKey="aiProofreader"
      category="ai-writing-tools"
      path="/ai-writing-tools/ai-proofreader"
      icon={Check}
      title="AI Proofreader"
      subtitle="Surface quick proofreading fixes and a cleaned draft."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.proofread}
    />
  );
}
