import { BarChart3 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function CsvVisualizer() {
  return (
    <IoToolShell
      seoKey="csvVisualizer"
      category="ai-data-tools"
      path="/ai-data-tools/csv-visualizer"
      icon={BarChart3}
      title="CSV Visualizer"
      subtitle="Inspect CSV columns and row counts."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.csv_visualizer}
    />
  );
}
