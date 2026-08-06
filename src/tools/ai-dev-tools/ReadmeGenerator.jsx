import { BookOpen } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function ReadmeGenerator() {
  return (
    <IoToolShell
      seoKey="readmeGenerator"
      category="ai-dev-tools"
      path="/ai-dev-tools/readme-generator"
      icon={BookOpen}
      title="README Generator"
      subtitle="Generate README skeletons."
      actionLabel="Run"
      transform={transforms.readme}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
