import { Lightbulb } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ExplainLikeIm10() {
  return (
    <IoToolShell
      seoKey="explainLikeIm10"
      category="ai-learning-tools"
      path="/ai-learning-tools/explain-like-im-10"
      icon={Lightbulb}
      title="Explain Like I'm 10"
      subtitle="Explain a concept in simple language."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.eli10}
    />
  );
}
