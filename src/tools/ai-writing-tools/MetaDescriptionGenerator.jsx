import { Search } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function MetaDescriptionGenerator() {
  return (
    <IoToolShell
      seoKey="metaDescriptionGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/meta-description-generator"
      icon={Search}
      title="Meta Description Generator"
      subtitle="Draft SEO meta descriptions under 160 characters."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.meta_description}
    />
  );
}
