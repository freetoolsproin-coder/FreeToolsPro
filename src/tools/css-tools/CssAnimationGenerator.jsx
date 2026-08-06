import { PlayCircle } from "lucide-react";
import CssGeneratorShell from "../_shared/CssGeneratorShell";

export default function CssAnimationGenerator() {
  return (
    <CssGeneratorShell
      seoKey="cssAnimationGenerator"
      category="css-tools"
      path="/css-tools/css-animation-generator"
      icon={PlayCircle}
      title="CSS Animation Generator"
      subtitle="Generate @keyframes snippets."
      kind="css_anim"
    />
  );
}
