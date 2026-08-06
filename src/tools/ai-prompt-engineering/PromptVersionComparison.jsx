import { GitCompare } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function PromptVersionComparison() {
  return (
    <IoToolShell
      seoKey="promptVersionComparison"
      category="ai-prompt-engineering"
      path="/ai-prompt-engineering/prompt-version-comparison"
      icon={GitCompare}
      title="Prompt Version Comparison"
      subtitle="Compare two prompt versions side by side."
      actionLabel="Generate"
      multiline={true}
      placeholder="Prompt A\\n---\\nPrompt B"
      transform={aiTransforms.prompt_compare}
    />
  );
}
