import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function UnitTestGenerator() {
  return (
    <IoToolShell
      seoKey="unitTestGenerator"
      category="ai-coding-tools"
      path="/ai-coding-tools/unit-test-generator"
      icon={Code2}
      title="Unit Test Generator"
      subtitle="Scaffold unit tests for a function name."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.unit_test_gen}
    />
  );
}
