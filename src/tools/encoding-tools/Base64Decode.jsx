import { Hash } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function Base64Decode() {
  return (
    <IoToolShell
      seoKey="base64Decode"
      category="encoding-tools"
      path="/encoding-tools/base64-decode"
      icon={Hash}
      title="Base64 Decode"
      subtitle="Decode Base64 to text."
      actionLabel="Run"
      transform={transforms.b64_decode}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
