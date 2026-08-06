import { Layers } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function FlashcardGenerator() {
  return (
    <IoToolShell
      seoKey="flashcardGenerator"
      category="ai-learning-tools"
      path="/ai-learning-tools/flashcard-generator"
      icon={Layers}
      title="Flashcard Generator"
      subtitle="Turn topics into Q&A flashcards."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.flashcards}
    />
  );
}
