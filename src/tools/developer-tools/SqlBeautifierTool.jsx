import { Database } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function SqlBeautifierTool() {
  return (
    <IoToolShell
      seoKey="sqlBeautifier"
      category="developer-tools"
      path="/developer-tools/sql-beautifier"
      icon={Database}
      title="SQL Beautifier"
      subtitle="Beautify SQL queries."
      actionLabel="Run"
      transform={transforms.sql_beautify}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
