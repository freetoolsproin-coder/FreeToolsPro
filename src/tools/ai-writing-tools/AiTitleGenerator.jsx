import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function AiTitleGenerator() {
  return (
    <IoToolShell
      seoKey="aiTitleGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/ai-title-generator"
      icon={Sparkles}
      title="AI Title Generator"
      subtitle="Generate click-worthy title options from a topic."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.ai_title}
    />
  );
}
