import { Share2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function FacebookAdGenerator() {
  return (
    <IoToolShell
      seoKey="facebookAdGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/facebook-ad-generator"
      icon={Share2}
      title="Facebook Ad Generator"
      subtitle="Draft Facebook/Meta ad copy blocks."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.facebook_ad}
    />
  );
}
