import { Image } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function AltTextGenerator() {
  return (
    <IoToolShell
      seoKey="altTextGenerator"
      category="ai-image-helpers"
      path="/ai-image-helpers/alt-text-generator"
      icon={Image}
      title="Alt Text Generator"
      subtitle="Write accessible image alt text."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.alt_text}
    />
  );
}
