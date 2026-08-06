import { LayoutGrid } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function LandingPageCopyGenerator() {
  return (
    <IoToolShell
      seoKey="landingPageCopyGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/landing-page-copy-generator"
      icon={LayoutGrid}
      title="Landing Page Copy Generator"
      subtitle="Draft hero, benefits, and CTA sections."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.landing_copy}
    />
  );
}
