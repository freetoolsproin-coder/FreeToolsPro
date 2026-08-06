import { FileText } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function GitignoreGenerator() {
  return (
    <IoToolShell
      seoKey="gitignoreGenerator"
      category="ai-dev-tools"
      path="/ai-dev-tools/gitignore-generator"
      icon={FileText}
      title=".gitignore Generator"
      subtitle="Generate .gitignore files."
      actionLabel="Run"
      transform={transforms.gitignore}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
