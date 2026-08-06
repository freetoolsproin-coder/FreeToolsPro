import { Link2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function SlugGenerator() {
  return (
    <IoToolShell
      seoKey="slugGenerator"
      category="text-tools"
      path="/text-tools/slug-generator"
      icon={Link2}
      title="Slug Generator"
      subtitle="Generate URL-safe slugs."
      actionLabel="Run"
      transform={transforms.slug}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
