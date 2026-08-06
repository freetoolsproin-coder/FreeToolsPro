import { MessageCircle } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function FaqGenerator() {
  return (
    <IoToolShell
      seoKey="faqGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/faq-generator"
      icon={MessageCircle}
      title="FAQ Generator"
      subtitle="Create FAQ Q&A blocks for pages and posts."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.faq_gen}
    />
  );
}
