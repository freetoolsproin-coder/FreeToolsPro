import { Sparkles } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function Es6Converter() {
  return (
    <IoToolShell
      seoKey="es6Converter"
      category="javascript-tools"
      path="/javascript-tools/es6-converter"
      icon={Sparkles}
      title="ES6 Converter"
      subtitle="Convert common patterns toward ES6."
      actionLabel="Run"
      transform={transforms.es6_convert}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
