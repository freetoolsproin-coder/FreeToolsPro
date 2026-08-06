import { RefreshCw } from "lucide-react";
import CssGeneratorShell from "../_shared/CssGeneratorShell";

export default function CssTransformGenerator() {
  return (
    <CssGeneratorShell
      seoKey="cssTransformGenerator"
      category="css-tools"
      path="/css-tools/css-transform-generator"
      icon={RefreshCw}
      title="CSS Transform Generator"
      subtitle="Build CSS transforms."
      kind="css_transform"
    />
  );
}
