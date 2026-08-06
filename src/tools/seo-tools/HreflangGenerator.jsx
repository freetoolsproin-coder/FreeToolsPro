import { Globe } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HreflangGenerator() {
  return (
    <IoToolShell
      seoKey="hreflangGenerator"
      category="seo-tools"
      path="/seo-tools/hreflang-generator"
      icon={Globe}
      title="Hreflang Generator"
      subtitle="Generate hreflang tags."
      actionLabel="Run"
      transform={transforms.hreflang}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
