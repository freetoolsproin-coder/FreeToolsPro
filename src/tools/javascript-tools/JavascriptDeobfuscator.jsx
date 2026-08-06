import { Lock } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JavascriptDeobfuscator() {
  return (
    <IoToolShell
      seoKey="javascriptDeobfuscator"
      category="javascript-tools"
      path="/javascript-tools/javascript-deobfuscator"
      icon={Lock}
      title="JavaScript Deobfuscator"
      subtitle="Best-effort JS deobfuscation."
      actionLabel="Run"
      transform={transforms.js_deobfuscate}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
