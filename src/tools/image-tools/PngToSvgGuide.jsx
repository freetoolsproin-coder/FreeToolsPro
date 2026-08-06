import { Image } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function PngToSvgGuide() {
  return (
    <IoToolShell
      seoKey="pngToSvgGuide"
      category="image-tools"
      path="/image-tools/png-to-svg-guide"
      icon={Image}
      title="PNG to SVG Guide"
      subtitle="Checklist for PNG→SVG conversion."
      actionLabel="Run"
      transform={transforms.png_svg_guide}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
