import { PenSquare } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function EssayImprover() {
  return (
    <IoToolShell
      seoKey="essayImprover"
      category="ai-learning-tools"
      path="/ai-learning-tools/essay-improver"
      icon={PenSquare}
      title="Essay Improver"
      subtitle="Get essay improvement steps and a stronger opening."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.essay_improve}
    />
  );
}
