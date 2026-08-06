import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function AiContentOptimizer() {
  return (
    <IoToolShell
      seoKey="aiContentOptimizer"
      category="ai-seo-tools"
      path="/ai-seo-tools/ai-content-optimizer"
      icon={Sparkles}
      title="AI Content Optimizer"
      subtitle="Get optimization tips for draft content."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.content_optimizer}
    />
  );
}
