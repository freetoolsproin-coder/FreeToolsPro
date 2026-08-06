import { FileText } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function EnvTemplateGenerator() {
  return (
    <IoToolShell
      seoKey="envTemplateGenerator"
      category="ai-dev-tools"
      path="/ai-dev-tools/env-template-generator"
      icon={FileText}
      title=".env Template Generator"
      subtitle="Generate .env.example templates."
      actionLabel="Run"
      transform={transforms.env_template}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
