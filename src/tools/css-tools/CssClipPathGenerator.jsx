import { Scissors } from "lucide-react";
import CssGeneratorShell from "../_shared/CssGeneratorShell";

export default function CssClipPathGenerator() {
  return (
    <CssGeneratorShell
      seoKey="cssClipPathGenerator"
      category="css-tools"
      path="/css-tools/css-clip-path-generator"
      icon={Scissors}
      title="CSS Clip Path Generator"
      subtitle="Generate clip-path polygons."
      kind="css_clip"
    />
  );
}
