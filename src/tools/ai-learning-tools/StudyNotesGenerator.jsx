import { BookOpen } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function StudyNotesGenerator() {
  return (
    <IoToolShell
      seoKey="studyNotesGenerator"
      category="ai-learning-tools"
      path="/ai-learning-tools/study-notes-generator"
      icon={BookOpen}
      title="Study Notes Generator"
      subtitle="Create structured study notes."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.study_notes}
    />
  );
}
