import { Monitor } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function AiWebsiteAuditor() {
  return (
    <IoToolShell
      seoKey="aiWebsiteAuditor"
      category="ai-website-auditor"
      path="/ai-website-auditor/ai-website-auditor"
      icon={Monitor}
      title="AI Website Auditor"
      subtitle="Run a practical website quality/SEO checklist."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.website_auditor}
    />
  );
}
