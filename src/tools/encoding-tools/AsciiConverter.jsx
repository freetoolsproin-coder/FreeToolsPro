import { Hash } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function AsciiConverter() {
  return (
    <IoToolShell
      seoKey="asciiConverter"
      category="encoding-tools"
      path="/encoding-tools/ascii-converter"
      icon={Hash}
      title="ASCII Converter"
      subtitle="Convert text to ASCII codes."
      actionLabel="Run"
      transform={transforms.ascii}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
