import { GitCompare } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function SkillGapAnalyzer() {
  return (
    <IoToolShell
      seoKey="skillGapAnalyzer"
      category="ai-resume-career"
      path="/ai-resume-career/skill-gap-analyzer"
      icon={GitCompare}
      title="Skill Gap Analyzer"
      subtitle="Compare your skills vs required skills."
      actionLabel="Generate"
      multiline={true}
      placeholder="html, css, js\\n---\\nreact, typescript, node"
      transform={aiTransforms.skill_gap}
    />
  );
}
