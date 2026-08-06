import { Share2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function OpenGraphGenerator() {
  return (
    <IoToolShell
      seoKey="openGraphGenerator"
      category="seo-tools"
      path="/seo-tools/open-graph-generator"
      icon={Share2}
      title="Open Graph Generator"
      subtitle="Generate Open Graph meta tags."
      actionLabel="Run"
      transform={transforms.og_gen}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
