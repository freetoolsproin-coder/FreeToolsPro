import { Package } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ProductDescriptionGenerator() {
  return (
    <IoToolShell
      seoKey="productDescriptionGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/product-description-generator"
      icon={Package}
      title="Product Description Generator"
      subtitle="Write benefit-led product descriptions."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.product_desc}
    />
  );
}
