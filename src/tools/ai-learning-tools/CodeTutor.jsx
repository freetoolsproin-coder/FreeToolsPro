import { GraduationCap } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function CodeTutor() {
  return (
    <IoToolShell
      seoKey="codeTutor"
      category="ai-learning-tools"
      path="/ai-learning-tools/code-tutor"
      icon={GraduationCap}
      title="Code Tutor"
      subtitle="Get a tutoring plan for understanding code."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.code_tutor}
    />
  );
}
