import { Network } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function GraphqlExplorer() {
  return (
    <IoToolShell
      seoKey="graphqlExplorer"
      category="api-tools"
      path="/api-tools/graphql-explorer"
      icon={Network}
      title="GraphQL Explorer"
      subtitle="Draft GraphQL queries with sample responses."
      actionLabel="Run"
      transform={transforms.graphql}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
