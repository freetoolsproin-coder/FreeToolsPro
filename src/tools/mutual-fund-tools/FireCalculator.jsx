import { Flame } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "expense",
    "label": "Monthly expense (₹)",
    "default": 80000
  },
  {
    "key": "withdraw",
    "label": "Withdrawal rate %",
    "default": 4,
    "step": 0.25
  },
  {
    "key": "savings",
    "label": "Current investments (₹)",
    "default": 2000000
  },
  {
    "key": "invest",
    "label": "Monthly invest (₹)",
    "default": 50000
  },
  {
    "key": "returnRate",
    "label": "Return % p.a.",
    "default": 12
  }
];

export default function FireCalculator() {
  return (
    <FinanceCalcShell
      seoKey="fireCalculator"
      category="mutual-fund-tools"
      path="/mutual-fund-tools/fire-calculator"
      icon={Flame}
      title="FIRE Calculator"
      subtitle="Estimate your FIRE number and years to financial independence."
      fields={fields}
      compute={financeCompute.fire}
    />
  );
}
