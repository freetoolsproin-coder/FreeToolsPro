import { BookOpen } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function ApiDocumentationGenerator() {
  return (
    <IoToolShell
      seoKey="apiDocumentationGenerator"
      category="api-tools"
      path="/api-tools/api-documentation-generator"
      icon={BookOpen}
      title="API Documentation Generator"
      subtitle="Draft Markdown API docs."
      actionLabel="Run"
      transform={transforms.api_docs}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
