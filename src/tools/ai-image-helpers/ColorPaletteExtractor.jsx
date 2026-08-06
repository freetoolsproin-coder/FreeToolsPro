import { Palette } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ColorPaletteExtractor() {
  return (
    <IoToolShell
      seoKey="colorPaletteExtractor"
      category="ai-image-helpers"
      path="/ai-image-helpers/color-palette-extractor"
      icon={Palette}
      title="Color Palette Extractor"
      subtitle="Generate a palette seed from a word or brand."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.color_palette}
    />
  );
}
