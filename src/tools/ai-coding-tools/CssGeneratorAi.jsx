import { Palette } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function CssGeneratorAi() {
  return (
    <IoToolShell
      seoKey="cssGeneratorAi"
      category="ai-coding-tools"
      path="/ai-coding-tools/css-generator-ai"
      icon={Palette}
      title="CSS Generator"
      subtitle="Generate starter CSS for a component name."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.css_gen}
    />
  );
}
