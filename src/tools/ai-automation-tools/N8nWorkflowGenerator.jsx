import { GitBranch } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function N8nWorkflowGenerator() {
  return (
    <IoToolShell
      seoKey="n8nWorkflowGenerator"
      category="ai-automation-tools"
      path="/ai-automation-tools/n8n-workflow-generator"
      icon={GitBranch}
      title="n8n Workflow Generator"
      subtitle="Sketch an n8n node sequence for a goal."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.n8n_workflow}
    />
  );
}
