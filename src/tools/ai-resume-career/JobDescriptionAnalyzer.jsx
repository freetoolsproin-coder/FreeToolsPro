import { Search } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function JobDescriptionAnalyzer() {
  return (
    <IoToolShell
      seoKey="jobDescriptionAnalyzer"
      category="ai-resume-career"
      path="/ai-resume-career/job-description-analyzer"
      icon={Search}
      title="Job Description Analyzer"
      subtitle="Extract must-have signals from a job description."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.jd_analyzer}
    />
  );
}
