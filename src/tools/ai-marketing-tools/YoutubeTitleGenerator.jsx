import { PlayCircle } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function YoutubeTitleGenerator() {
  return (
    <IoToolShell
      seoKey="youtubeTitleGenerator"
      category="ai-marketing-tools"
      path="/ai-marketing-tools/youtube-title-generator"
      icon={PlayCircle}
      title="YouTube Title Generator"
      subtitle="Generate YouTube title ideas."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.yt_title}
    />
  );
}
