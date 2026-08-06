import { Gauge } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function PromptQualityScore() {
  return (
    <IoToolShell
      seoKey="promptQualityScore"
      category="ai-prompt-engineering"
      path="/ai-prompt-engineering/prompt-quality-score"
      icon={Gauge}
      title="Prompt Quality Score"
      subtitle="Score prompt quality with a simple checklist."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.prompt_score}
    />
  );
}
