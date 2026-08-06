import { PiggyBank } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "invest",
    "label": "80C investments (₹)",
    "default": 120000
  }
];

export default function Section80cCalculator() {
  return (
    <FinanceCalcShell
      seoKey="section80cCalculator"
      category="tax-tools"
      path="/tax-tools/section-80c-calculator"
      icon={PiggyBank}
      title="Section 80C Calculator"
      subtitle="Track Section 80C investments against the ₹1.5L limit."
      fields={fields}
      compute={financeCompute.section_80c}
    />
  );
}
