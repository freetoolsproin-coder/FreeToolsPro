import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function BrandSloganGenerator() {
  return (
    <IoToolShell
      seoKey="brandSloganGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/brand-slogan-generator"
      icon={Sparkles}
      title="Brand Slogan Generator"
      subtitle="Create short brand slogans."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.slogan_gen}
    />
  );
}
