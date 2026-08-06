import { Table2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JsonToCsv() {
  return (
    <IoToolShell
      seoKey="jsonToCsv"
      category="json-tools"
      path="/json-tools/json-to-csv"
      icon={Table2}
      title="JSON to CSV"
      subtitle="Flatten JSON arrays into CSV."
      actionLabel="Run"
      transform={transforms.json_to_csv}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
