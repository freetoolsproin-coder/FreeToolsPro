import { MessageCircle } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function FaqGeneratorSeo() {
  return (
    <IoToolShell
      seoKey="faqGeneratorSeo"
      category="ai-seo-tools"
      path="/ai-seo-tools/faq-generator-seo"
      icon={MessageCircle}
      title="FAQ Generator (SEO)"
      subtitle="Create FAQ blocks optimized for search snippets."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.faq_gen}
    />
  );
}
