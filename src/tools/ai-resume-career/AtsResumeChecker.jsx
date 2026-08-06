import { FileCheck2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function AtsResumeChecker() {
  return (
    <IoToolShell
      seoKey="atsResumeChecker"
      category="ai-resume-career"
      path="/ai-resume-career/ats-resume-checker"
      icon={FileCheck2}
      title="ATS Resume Checker"
      subtitle="Check resume text for common ATS issues."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.ats_resume}
    />
  );
}
