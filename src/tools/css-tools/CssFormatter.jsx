import { Palette } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CssFormatter() {
  return (
    <IoToolShell
      seoKey="cssFormatter"
      category="css-tools"
      path="/css-tools/css-formatter"
      icon={Palette}
      title="CSS Formatter"
      subtitle="Format CSS with consistent spacing."
      actionLabel="Run"
      transform={transforms.css_format}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
