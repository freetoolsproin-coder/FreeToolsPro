import { Minimize2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CssMinifier() {
  return (
    <IoToolShell
      seoKey="cssMinifier"
      category="css-tools"
      path="/css-tools/css-minifier"
      icon={Minimize2}
      title="CSS Minifier"
      subtitle="Minify CSS payloads."
      actionLabel="Run"
      transform={transforms.css_minify}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
