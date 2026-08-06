import { GitBranch } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function WorkflowGenerator() {
  return (
    <IoToolShell
      seoKey="workflowGenerator"
      category="ai-automation-tools"
      path="/ai-automation-tools/workflow-generator"
      icon={GitBranch}
      title="Workflow Generator"
      subtitle="Draft a generic automation workflow."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.workflow_gen}
    />
  );
}
