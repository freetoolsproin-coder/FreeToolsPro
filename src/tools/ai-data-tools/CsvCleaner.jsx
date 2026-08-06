import { Table2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function CsvCleaner() {
  return (
    <IoToolShell
      seoKey="csvCleaner"
      category="ai-data-tools"
      path="/ai-data-tools/csv-cleaner"
      icon={Table2}
      title="CSV Cleaner"
      subtitle="Normalize messy CSV spacing and quotes."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.csv_clean}
    />
  );
}
