import { PiggyBank } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "basic",
    "label": "Monthly basic (₹)",
    "default": 40000
  }
];

export default function PfCalculator() {
  return (
    <FinanceCalcShell
      seoKey="pfCalculator"
      category="salary-hr"
      path="/salary-hr/pf-calculator"
      icon={PiggyBank}
      title="PF Calculator"
      subtitle="Calculate employee and employer PF contributions."
      fields={fields}
      compute={financeCompute.pf_calc}
    />
  );
}
