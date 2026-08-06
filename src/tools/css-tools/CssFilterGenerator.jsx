import { Filter } from "lucide-react";
import CssGeneratorShell from "../_shared/CssGeneratorShell";

export default function CssFilterGenerator() {
  return (
    <CssGeneratorShell
      seoKey="cssFilterGenerator"
      category="css-tools"
      path="/css-tools/css-filter-generator"
      icon={Filter}
      title="CSS Filter Generator"
      subtitle="Compose CSS filter stacks."
      kind="css_filter"
    />
  );
}
