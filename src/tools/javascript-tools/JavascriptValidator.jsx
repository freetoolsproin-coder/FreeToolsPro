import { ShieldCheck } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function JavascriptValidator() {
  return (
    <IoToolShell
      seoKey="javascriptValidator"
      category="javascript-tools"
      path="/javascript-tools/javascript-validator"
      icon={ShieldCheck}
      title="JavaScript Validator"
      subtitle="Check basic JavaScript syntax."
      actionLabel="Run"
      transform={transforms.js_validate}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
