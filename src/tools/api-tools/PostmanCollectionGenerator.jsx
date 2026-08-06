import { Package } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function PostmanCollectionGenerator() {
  return (
    <IoToolShell
      seoKey="postmanCollectionGenerator"
      category="api-tools"
      path="/api-tools/postman-collection-generator"
      icon={Package}
      title="Postman Collection Generator"
      subtitle="Generate Postman v2.1 collection JSON."
      actionLabel="Run"
      transform={transforms.postman}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
