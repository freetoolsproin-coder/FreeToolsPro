import { FileText } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ExecutiveSummaryGenerator() {
  return (
    <IoToolShell
      seoKey="executiveSummaryGenerator"
      category="ai-office-tools"
      path="/ai-office-tools/executive-summary-generator"
      icon={FileText}
      title="Executive Summary Generator"
      subtitle="Summarize an initiative for executives."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.exec_summary}
    />
  );
}
