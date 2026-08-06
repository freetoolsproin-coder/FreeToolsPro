import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ResumeOptimizer() {
  return (
    <IoToolShell
      seoKey="resumeOptimizer"
      category="ai-resume-career"
      path="/ai-resume-career/resume-optimizer"
      icon={Sparkles}
      title="Resume Optimizer"
      subtitle="Get rewrite tips and a stronger sample bullet."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.resume_optimize}
    />
  );
}
