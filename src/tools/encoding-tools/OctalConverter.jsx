import { Hash } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function OctalConverter() {
  return (
    <IoToolShell
      seoKey="octalConverter"
      category="encoding-tools"
      path="/encoding-tools/octal-converter"
      icon={Hash}
      title="Octal Converter"
      subtitle="Convert numbers to octal."
      actionLabel="Run"
      transform={transforms.octal}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
