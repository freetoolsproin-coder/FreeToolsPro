import { Search } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function GoogleAdsHeadlineGenerator() {
  return (
    <IoToolShell
      seoKey="googleAdsHeadlineGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/google-ads-headline-generator"
      icon={Search}
      title="Google Ads Headline Generator"
      subtitle="Create Google Ads headline options."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.google_ads}
    />
  );
}
