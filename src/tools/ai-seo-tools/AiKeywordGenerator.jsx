import { Tags } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function AiKeywordGenerator() {
  return (
    <IoToolShell
      seoKey="aiKeywordGenerator"
      category="ai-seo-tools"
      path="/ai-seo-tools/ai-keyword-generator"
      icon={Tags}
      title="AI Keyword Generator"
      subtitle="Brainstorm keyword variations around a seed term."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.keyword_gen}
    />
  );
}
