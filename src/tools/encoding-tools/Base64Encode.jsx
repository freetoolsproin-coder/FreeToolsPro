import { Hash } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function Base64Encode() {
  return (
    <IoToolShell
      seoKey="base64Encode"
      category="encoding-tools"
      path="/encoding-tools/base64-encode"
      icon={Hash}
      title="Base64 Encode"
      subtitle="Encode text to Base64."
      actionLabel="Run"
      transform={transforms.b64_encode}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
