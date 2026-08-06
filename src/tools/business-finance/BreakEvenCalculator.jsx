import { Target } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "fixed",
    "label": "Fixed costs (₹)",
    "default": 500000
  },
  {
    "key": "price",
    "label": "Price / unit (₹)",
    "default": 500
  },
  {
    "key": "variable",
    "label": "Variable cost / unit (₹)",
    "default": 300
  }
];

export default function BreakEvenCalculator() {
  return (
    <FinanceCalcShell
      seoKey="breakEvenCalculator"
      category="business-finance"
      path="/business-finance/break-even-calculator"
      icon={Target}
      title="Break-even Calculator"
      subtitle="Find break-even units and revenue."
      fields={fields}
      compute={financeCompute.breakeven}
    />
  );
}
