import { ListOrdered } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function HeadingOptimizer() {
  return (
    <IoToolShell
      seoKey="headingOptimizer"
      category="ai-seo-tools"
      path="/ai-seo-tools/heading-optimizer"
      icon={ListOrdered}
      title="Heading Optimizer"
      subtitle="Turn rough headings into clean H1/H2 structure."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.heading_optimizer}
    />
  );
}
