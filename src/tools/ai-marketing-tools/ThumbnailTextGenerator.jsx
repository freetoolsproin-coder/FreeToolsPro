import { Image } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ThumbnailTextGenerator() {
  return (
    <IoToolShell
      seoKey="thumbnailTextGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/thumbnail-text-generator"
      icon={Image}
      title="Thumbnail Text Generator"
      subtitle="Short punchy thumbnail text ideas."
      actionLabel="Generate"
      multiline={false}
      placeholder="Paste input or topic…"
      transform={aiTransforms.thumbnail_text}
    />
  );
}
