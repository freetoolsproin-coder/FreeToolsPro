import { Image } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ImageCaptionGenerator() {
  return (
    <IoToolShell
      seoKey="imageCaptionGenerator"
      category="ai-image-helpers"
      path="/ai-image-helpers/image-caption-generator"
      icon={Image}
      title="Image Caption Generator"
      subtitle="Generate short image captions."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.image_caption}
    />
  );
}
