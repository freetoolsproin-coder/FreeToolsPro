import { Minimize2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function SvgOptimizer() {
  return (
    <IoToolShell
      seoKey="svgOptimizer"
      category="image-tools"
      path="/image-tools/svg-optimizer"
      icon={Minimize2}
      title="SVG Optimizer"
      subtitle="Strip comments/metadata from SVG."
      actionLabel="Run"
      transform={transforms.svg_opt}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
