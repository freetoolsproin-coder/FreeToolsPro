import { BookOpen } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ReadmeGeneratorAi() {
  return (
    <IoToolShell
      seoKey="readmeGeneratorAi"
      category="ai-coding-tools"
      path="/ai-coding-tools/readme-generator-ai"
      icon={BookOpen}
      title="README Generator"
      subtitle="Generate a project README skeleton."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.readme_ai}
    />
  );
}
