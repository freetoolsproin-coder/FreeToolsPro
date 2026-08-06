import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function PromptEnhancer() {
  return (
    <IoToolShell
      seoKey="promptEnhancer"
      category="ai-prompt-engineering"
      path="/ai-prompt-engineering/prompt-enhancer"
      icon={Sparkles}
      title="Prompt Enhancer"
      subtitle="Expand a prompt with constraints and examples."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.prompt_enhance}
    />
  );
}
