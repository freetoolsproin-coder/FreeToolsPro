import { BookOpen } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function SqlCheatSheet() {
  return (
    <IoToolShell
      seoKey="sqlCheatSheet"
      category="developer-tools"
      path="/developer-tools/sql-cheat-sheet"
      icon={BookOpen}
      title="SQL Cheat Sheet"
      subtitle="Quick SQL reference sheet."
      actionLabel="Run"
      transform={transforms.sql_sheet}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
