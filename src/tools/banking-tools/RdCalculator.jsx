import { PiggyBank } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "monthly",
    "label": "Monthly deposit (₹)",
    "default": 5000
  },
  {
    "key": "rate",
    "label": "Interest % p.a.",
    "default": 6.5
  },
  {
    "key": "months",
    "label": "Months",
    "default": 36
  }
];

export default function RdCalculator() {
  return (
    <FinanceCalcShell
      seoKey="rdCalculator"
      category="banking-tools"
      path="/banking-tools/rd-calculator"
      icon={PiggyBank}
      title="RD Calculator"
      subtitle="Calculate recurring deposit maturity value."
      fields={fields}
      compute={financeCompute.rd}
    />
  );
}
