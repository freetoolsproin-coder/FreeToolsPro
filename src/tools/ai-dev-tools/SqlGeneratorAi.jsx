import { Database } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function SqlGeneratorAi() {
  return (
    <IoToolShell
      seoKey="sqlGenerator"
      category="ai-dev-tools"
      path="/ai-dev-tools/sql-generator"
      icon={Database}
      title="SQL Generator"
      subtitle="Generate SQL from a plain request."
      actionLabel="Run"
      transform={transforms.sql_gen}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
