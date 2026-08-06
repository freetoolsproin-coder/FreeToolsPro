import { Hash } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function BinaryConverter() {
  return (
    <IoToolShell
      seoKey="binaryConverter"
      category="encoding-tools"
      path="/encoding-tools/binary-converter"
      icon={Hash}
      title="Binary Converter"
      subtitle="Convert text to binary."
      actionLabel="Run"
      transform={transforms.binary}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
