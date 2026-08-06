import { Link2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CanonicalUrlGenerator() {
  return (
    <IoToolShell
      seoKey="canonicalUrlGenerator"
      category="seo-tools"
      path="/seo-tools/canonical-url-generator"
      icon={Link2}
      title="Canonical URL Generator"
      subtitle="Generate canonical link tags."
      actionLabel="Run"
      transform={transforms.canonical_gen}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
