import { SearchCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function SeoAuditAi() {
  return (
    <IoToolShell
      seoKey="seoAuditAi"
      category="ai-seo-tools"
      path="/ai-seo-tools/seo-audit-ai"
      icon={SearchCheck}
      title="SEO Audit"
      subtitle="Run an AI-style SEO checklist for a page or topic."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.seo_audit_ai}
    />
  );
}
