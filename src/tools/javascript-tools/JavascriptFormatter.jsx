import { FileCode2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JavascriptFormatter() {
  return (
    <IoToolShell
      seoKey="javascriptFormatter"
      category="javascript-tools"
      path="/javascript-tools/javascript-formatter"
      icon={FileCode2}
      title="JavaScript Formatter"
      subtitle="Format JavaScript code."
      actionLabel="Run"
      transform={transforms.js_format}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
