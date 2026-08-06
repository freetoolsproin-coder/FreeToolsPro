import { SearchCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function CodeReviewer() {
  return (
    <IoToolShell
      seoKey="codeReviewer"
      category="ai-coding-tools"
      path="/ai-coding-tools/code-reviewer"
      icon={SearchCheck}
      title="Code Reviewer"
      subtitle="Get a quick static code-review checklist on pasted code."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.code_review}
    />
  );
}
