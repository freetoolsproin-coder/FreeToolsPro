import { MousePointerClick } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function CallToActionGenerator() {
  return (
    <IoToolShell
      seoKey="callToActionGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/call-to-action-generator"
      icon={MousePointerClick}
      title="Call-to-Action Generator"
      subtitle="Generate CTA button and line options."
      actionLabel="Generate"
      multiline={false}
      placeholder="Paste input or topic…"
      transform={aiTransforms.cta_gen}
    />
  );
}
