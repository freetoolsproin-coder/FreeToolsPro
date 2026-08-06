import { Wand2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function BabelPlayground() {
  return (
    <IoToolShell
      seoKey="babelPlayground"
      category="javascript-tools"
      path="/javascript-tools/babel-playground"
      icon={Wand2}
      title="Babel Playground"
      subtitle="Explore demo ESNext down-level transforms."
      actionLabel="Run"
      transform={transforms.babel_play}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
