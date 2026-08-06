import { Share2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function AdCopyGenerator() {
  return (
    <IoToolShell
      seoKey="adCopyGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/ad-copy-generator"
      icon={Share2}
      title="Ad Copy Generator"
      subtitle="Generate ad headline, primary text, and CTA."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.ad_copy}
    />
  );
}
