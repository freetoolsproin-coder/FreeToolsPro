import { Hash } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HexConverter() {
  return (
    <IoToolShell
      seoKey="hexConverter"
      category="encoding-tools"
      path="/encoding-tools/hex-converter"
      icon={Hash}
      title="Hex Converter"
      subtitle="Convert text to hexadecimal."
      actionLabel="Run"
      transform={transforms.hex}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
