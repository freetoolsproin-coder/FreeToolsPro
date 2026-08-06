import { Layers } from "lucide-react";
import CssGeneratorShell from "../_shared/CssGeneratorShell";

export default function CssShadowGenerator() {
  return (
    <CssGeneratorShell
      seoKey="cssShadowGenerator"
      category="css-tools"
      path="/css-tools/css-shadow-generator"
      icon={Layers}
      title="CSS Shadow Generator"
      subtitle="Build box-shadow CSS with controls."
      kind="css_shadow"
    />
  );
}
