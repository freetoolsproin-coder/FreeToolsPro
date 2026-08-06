import { Database } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function SqlToCsvAi() {
  return (
    <IoToolShell
      seoKey="sqlToCsv"
      category="ai-data-tools"
      path="/ai-data-tools/sql-to-csv"
      icon={Database}
      title="SQL to CSV"
      subtitle="Convert simple SQL value lists to CSV rows."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.sql_to_csv}
    />
  );
}
