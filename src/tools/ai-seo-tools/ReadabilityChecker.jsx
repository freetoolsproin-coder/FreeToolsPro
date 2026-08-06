import { BookOpen } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ReadabilityChecker() {
  return (
    <IoToolShell
      seoKey="readabilityChecker"
      category="ai-seo-tools"
      path="/ai-seo-tools/readability-checker"
      icon={BookOpen}
      title="Readability Checker"
      subtitle="Estimate readability from sentence length."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.readability}
    />
  );
}
