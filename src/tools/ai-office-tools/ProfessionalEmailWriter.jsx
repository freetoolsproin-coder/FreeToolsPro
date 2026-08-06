import { Mail } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ProfessionalEmailWriter() {
  return (
    <IoToolShell
      seoKey="professionalEmailWriter"
      category="ai-office-tools"
      path="/ai-office-tools/professional-email-writer"
      icon={Mail}
      title="Professional Email Writer"
      subtitle="Write polished professional emails."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.email_gen}
    />
  );
}
