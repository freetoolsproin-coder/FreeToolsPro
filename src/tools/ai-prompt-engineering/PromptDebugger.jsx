import { Bug } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function PromptDebugger() {
  return (
    <IoToolShell
      seoKey="promptDebugger"
      category="ai-prompt-engineering"
      path="/ai-prompt-engineering/prompt-debugger"
      icon={Bug}
      title="Prompt Debugger"
      subtitle="Diagnose weak prompts and fix gaps."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.prompt_debug}
    />
  );
}
