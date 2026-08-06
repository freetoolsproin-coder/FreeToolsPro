import { Type } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function UnicodeConverter() {
  return (
    <IoToolShell
      seoKey="unicodeConverter"
      category="encoding-tools"
      path="/encoding-tools/unicode-converter"
      icon={Type}
      title="Unicode Converter"
      subtitle="Convert text to Unicode code points."
      actionLabel="Run"
      transform={transforms.unicode}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
