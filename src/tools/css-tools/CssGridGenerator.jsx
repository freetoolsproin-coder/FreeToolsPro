import { LayoutGrid } from "lucide-react";
import CssGeneratorShell from "../_shared/CssGeneratorShell";

export default function CssGridGenerator() {
  return (
    <CssGeneratorShell
      seoKey="cssGridGenerator"
      category="css-tools"
      path="/css-tools/css-grid-generator"
      icon={LayoutGrid}
      title="CSS Grid Generator"
      subtitle="Compose CSS grid templates."
      kind="css_grid"
    />
  );
}
