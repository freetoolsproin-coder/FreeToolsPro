import { Minimize2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function PromptShortener() {
  return (
    <IoToolShell
      seoKey="promptShortener"
      category="ai-prompt-engineering"
      path="/ai-prompt-engineering/prompt-shortener"
      icon={Minimize2}
      title="Prompt Shortener"
      subtitle="Tighten long prompts while keeping intent."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.prompt_shorten}
    />
  );
}
