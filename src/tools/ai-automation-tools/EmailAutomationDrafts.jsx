import { Mail } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function EmailAutomationDrafts() {
  return (
    <IoToolShell
      seoKey="emailAutomationDrafts"
      category="ai-automation-tools"
      path="/ai-automation-tools/email-automation-drafts"
      icon={Mail}
      title="Email Automation Drafts"
      subtitle="Draft a simple email nurture sequence."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.email_automation}
    />
  );
}
