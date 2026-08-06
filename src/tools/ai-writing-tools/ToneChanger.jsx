import { Wand2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ToneChanger() {
  return (
    <IoToolShell
      seoKey="toneChanger"
      category="ai-writing-tools"
      path="/ai-writing-tools/tone-changer"
      icon={Wand2}
      title="Tone Changer"
      subtitle="Change writing tone (professional, casual, friendly)."
      actionLabel="Generate"
      multiline={true}
      placeholder="professional\\nPaste text to restyle…"
      transform={aiTransforms.tone_change}
    />
  );
}
