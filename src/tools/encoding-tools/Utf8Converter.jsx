import { Hash } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function Utf8Converter() {
  return (
    <IoToolShell
      seoKey="utf8Converter"
      category="encoding-tools"
      path="/encoding-tools/utf8-converter"
      icon={Hash}
      title="UTF-8 Converter"
      subtitle="Show UTF-8 bytes for text."
      actionLabel="Run"
      transform={transforms.utf8}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
