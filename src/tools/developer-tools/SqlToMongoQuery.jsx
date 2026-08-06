import { Database } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function SqlToMongoQuery() {
  return (
    <IoToolShell
      seoKey="sqlToMongoQuery"
      category="developer-tools"
      path="/developer-tools/sql-to-mongo-query"
      icon={Database}
      title="SQL to Mongo Query"
      subtitle="Translate simple SQL to Mongo find()."
      actionLabel="Run"
      transform={transforms.sql_mongo}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
