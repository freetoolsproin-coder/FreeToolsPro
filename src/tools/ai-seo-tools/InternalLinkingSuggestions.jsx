import { Link2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function InternalLinkingSuggestions() {
  return (
    <IoToolShell
      seoKey="internalLinkingSuggestions"
      category="ai-seo-tools"
      path="/ai-seo-tools/internal-linking-suggestions"
      icon={Link2}
      title="Internal Linking Suggestions"
      subtitle="Suggest internal link opportunities for an article."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.internal_links}
    />
  );
}
