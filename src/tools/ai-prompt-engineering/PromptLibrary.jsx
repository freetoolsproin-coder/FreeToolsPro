import { BookOpen } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function PromptLibrary() {
  return (
    <IoToolShell
      seoKey="promptLibrary"
      category="ai-prompt-engineering"
      path="/ai-prompt-engineering/prompt-library"
      icon={BookOpen}
      title="Prompt Library"
      subtitle="Browse reusable prompt starters."
      actionLabel="Generate"
      multiline={false}
      placeholder="Paste input or topic…"
      transform={aiTransforms.prompt_library}
    />
  );
}
