import { Image } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function BackgroundDescriptionGenerator() {
  return (
    <IoToolShell
      seoKey="backgroundDescriptionGenerator"
      category="ai-image-helpers"
      path="/ai-image-helpers/background-description-generator"
      icon={Image}
      title="Background Description Generator"
      subtitle="Describe backgrounds for design or generation."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.bg_description}
    />
  );
}
