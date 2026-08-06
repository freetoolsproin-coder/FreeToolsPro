import { FileUser } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function CoverLetterGenerator() {
  return (
    <IoToolShell
      seoKey="coverLetterGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/cover-letter-generator"
      icon={FileUser}
      title="Cover Letter Generator"
      subtitle="Generate a tailored cover letter draft."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.cover_letter}
    />
  );
}
