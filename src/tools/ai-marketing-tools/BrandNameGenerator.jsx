import { Lightbulb } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function BrandNameGenerator() {
  return (
    <IoToolShell
      seoKey="brandNameGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/brand-name-generator"
      icon={Lightbulb}
      title="Brand Name Generator"
      subtitle="Brainstorm brand name candidates."
      actionLabel="Generate"
      multiline={false}
      placeholder="Paste input or topic…"
      transform={aiTransforms.brand_name}
    />
  );
}
