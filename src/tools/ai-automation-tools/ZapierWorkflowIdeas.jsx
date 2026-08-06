import { Zap } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ZapierWorkflowIdeas() {
  return (
    <IoToolShell
      seoKey="zapierWorkflowIdeas"
      category="ai-automation-tools"
      path="/ai-automation-tools/zapier-workflow-ideas"
      icon={Zap}
      title="Zapier Workflow Ideas"
      subtitle="Brainstorm Zapier-style automations."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.zapier_ideas}
    />
  );
}
