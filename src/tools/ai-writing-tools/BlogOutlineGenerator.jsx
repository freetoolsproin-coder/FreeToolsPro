import { FileText } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function BlogOutlineGenerator() {
  return (
    <IoToolShell
      seoKey="blogOutlineGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/blog-outline-generator"
      icon={FileText}
      title="Blog Outline Generator"
      subtitle="Build a structured blog outline in seconds."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.blog_outline}
    />
  );
}
