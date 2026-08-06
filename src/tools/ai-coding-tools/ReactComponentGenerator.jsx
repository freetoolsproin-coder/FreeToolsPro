import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ReactComponentGenerator() {
  return (
    <IoToolShell
      seoKey="reactComponentGenerator"
      category="ai-coding-tools"
      path="/ai-coding-tools/react-component-generator"
      icon={Code2}
      title="React Component Generator"
      subtitle="Scaffold a React function component."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.react_component}
    />
  );
}
