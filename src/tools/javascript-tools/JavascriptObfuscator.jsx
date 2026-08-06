import { Lock } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JavascriptObfuscator() {
  return (
    <IoToolShell
      seoKey="javascriptObfuscator"
      category="javascript-tools"
      path="/javascript-tools/javascript-obfuscator"
      icon={Lock}
      title="JavaScript Obfuscator"
      subtitle="Lightly obfuscate JavaScript identifiers."
      actionLabel="Run"
      transform={transforms.js_obfuscate}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
