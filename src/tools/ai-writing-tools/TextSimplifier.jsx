import { Type } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function TextSimplifier() {
  return (
    <IoToolShell
      seoKey="textSimplifier"
      category="ai-writing-tools"
      path="/ai-writing-tools/text-simplifier"
      icon={Type}
      title="Text Simplifier"
      subtitle="Simplify complex wording for easier reading."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.simplify}
    />
  );
}
