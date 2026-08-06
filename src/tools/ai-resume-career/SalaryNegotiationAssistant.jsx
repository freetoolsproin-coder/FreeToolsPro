import { BadgeIndianRupee } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function SalaryNegotiationAssistant() {
  return (
    <IoToolShell
      seoKey="salaryNegotiationAssistant"
      category="ai-resume-career"
      path="/ai-resume-career/salary-negotiation-assistant"
      icon={BadgeIndianRupee}
      title="Salary Negotiation Assistant"
      subtitle="Get a practical negotiation script outline."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.salary_negotiate}
    />
  );
}
