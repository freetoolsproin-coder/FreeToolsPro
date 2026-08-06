import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function PromptGeneratorImageModels() {
  return (
    <IoToolShell
      seoKey="promptGeneratorImageModels"
      category="ai-image-helpers"
      path="/ai-image-helpers/prompt-generator-image-models"
      icon={Sparkles}
      title="Prompt Generator for Image Models"
      subtitle="Write image-model prompts from a subject."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.image_prompt}
    />
  );
}
