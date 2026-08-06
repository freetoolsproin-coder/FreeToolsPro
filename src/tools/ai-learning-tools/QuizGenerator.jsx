import { ListOrdered } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function QuizGenerator() {
  return (
    <IoToolShell
      seoKey="quizGenerator"
      category="ai-learning-tools"
      path="/ai-learning-tools/quiz-generator"
      icon={ListOrdered}
      title="Quiz Generator"
      subtitle="Generate a short quiz from a topic."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.quiz_gen}
    />
  );
}
