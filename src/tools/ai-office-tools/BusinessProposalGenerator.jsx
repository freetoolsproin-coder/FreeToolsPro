import { BriefcaseBusiness } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function BusinessProposalGenerator() {
  return (
    <IoToolShell
      seoKey="businessProposalGenerator"
      category="ai-office-tools"
      path="/ai-office-tools/business-proposal-generator"
      icon={BriefcaseBusiness}
      title="Business Proposal Generator"
      subtitle="Draft a short business proposal outline."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.proposal_gen}
    />
  );
}
