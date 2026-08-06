import { Calculator } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function FormulaExplainer() {
  return (
    <IoToolShell
      seoKey="formulaExplainer"
      category="ai-learning-tools"
      path="/ai-learning-tools/formula-explainer"
      icon={Calculator}
      title="Formula Explainer"
      subtitle="Explain a formula in plain English."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.formula_explain}
    />
  );
}
