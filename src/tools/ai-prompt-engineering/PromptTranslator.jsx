import { Globe } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function PromptTranslator() {
  return (
    <IoToolShell
      seoKey="promptTranslator"
      category="ai-prompt-engineering"
      path="/ai-prompt-engineering/prompt-translator"
      icon={Globe}
      title="Prompt Translator"
      subtitle="Adapt a prompt for another language output."
      actionLabel="Generate"
      multiline={true}
      placeholder="Hindi\\nYour prompt here…"
      transform={aiTransforms.prompt_translate}
    />
  );
}
