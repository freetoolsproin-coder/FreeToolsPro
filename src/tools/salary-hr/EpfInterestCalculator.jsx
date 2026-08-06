import { PiggyBank } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "monthly",
    "label": "Monthly contribution (₹)",
    "default": 5000
  },
  {
    "key": "rate",
    "label": "Interest % p.a.",
    "default": 8.25,
    "step": 0.05
  },
  {
    "key": "years",
    "label": "Years",
    "default": 15
  }
];

export default function EpfInterestCalculator() {
  return (
    <FinanceCalcShell
      seoKey="epfInterestCalculator"
      category="salary-hr"
      path="/salary-hr/epf-interest-calculator"
      icon={PiggyBank}
      title="EPF Interest Calculator"
      subtitle="Project EPF corpus with assumed interest."
      fields={fields}
      compute={financeCompute.epf_interest}
    />
  );
}
