import { Mail } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function EmailGenerator() {
  return (
    <IoToolShell
      seoKey="emailGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/email-generator"
      icon={Mail}
      title="Email Generator"
      subtitle="Draft professional emails from a short brief."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.email_gen}
    />
  );
}
