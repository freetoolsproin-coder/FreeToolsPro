import { BarChart3 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function DataSummarizer() {
  return (
    <IoToolShell
      seoKey="dataSummarizer"
      category="ai-data-tools"
      path="/ai-data-tools/data-summarizer"
      icon={BarChart3}
      title="Data Summarizer"
      subtitle="Summarize row/column shape of pasted data."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.data_summarizer}
    />
  );
}
