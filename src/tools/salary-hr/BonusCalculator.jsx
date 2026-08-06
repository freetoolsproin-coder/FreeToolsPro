import { Award } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "salary",
    "label": "Monthly salary (₹)",
    "default": 50000
  },
  {
    "key": "months",
    "label": "Bonus months",
    "default": 1,
    "step": 0.5
  }
];

export default function BonusCalculator() {
  return (
    <FinanceCalcShell
      seoKey="bonusCalculator"
      category="salary-hr"
      path="/salary-hr/bonus-calculator"
      icon={Award}
      title="Bonus Calculator"
      subtitle="Calculate bonus as months of salary."
      fields={fields}
      compute={financeCompute.bonus}
    />
  );
}
