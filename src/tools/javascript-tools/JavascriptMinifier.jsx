import { Minimize2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JavascriptMinifier() {
  return (
    <IoToolShell
      seoKey="javascriptMinifier"
      category="javascript-tools"
      path="/javascript-tools/javascript-minifier"
      icon={Minimize2}
      title="JavaScript Minifier"
      subtitle="Minify JavaScript code."
      actionLabel="Run"
      transform={transforms.js_minify}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
