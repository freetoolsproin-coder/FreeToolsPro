import { LayoutGrid } from "lucide-react";
import CssGeneratorShell from "../_shared/CssGeneratorShell";

export default function CssFlexboxGenerator() {
  return (
    <CssGeneratorShell
      seoKey="cssFlexboxGenerator"
      category="css-tools"
      path="/css-tools/css-flexbox-generator"
      icon={LayoutGrid}
      title="CSS Flexbox Generator"
      subtitle="Compose flexbox layouts."
      kind="css_flex"
    />
  );
}
