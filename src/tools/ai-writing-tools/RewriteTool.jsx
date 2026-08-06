import { PenSquare } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function RewriteTool() {
  return (
    <IoToolShell
      seoKey="rewriteTool"
      category="ai-writing-tools"
      path="/ai-writing-tools/rewrite-tool"
      icon={PenSquare}
      title="Rewrite Tool"
      subtitle="Rewrite text with clearer wording."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.rewrite}
    />
  );
}
