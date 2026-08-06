import { Share2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function LinkedinPostGenerator() {
  return (
    <IoToolShell
      seoKey="linkedinPostGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/linkedin-post-generator"
      icon={Share2}
      title="LinkedIn Post Generator"
      subtitle="Create LinkedIn posts with hooks and hashtags."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.linkedin_post}
    />
  );
}
