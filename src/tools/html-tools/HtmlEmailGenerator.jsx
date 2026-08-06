import { Mail } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HtmlEmailGenerator() {
  return (
    <IoToolShell
      seoKey="htmlEmailGenerator"
      category="html-tools"
      path="/html-tools/html-email-generator"
      icon={Mail}
      title="HTML Email Generator"
      subtitle="Generate HTML email skeletons."
      actionLabel="Run"
      transform={transforms.html_email}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
