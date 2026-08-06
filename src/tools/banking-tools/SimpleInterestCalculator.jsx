import { Percent } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "principal",
    "label": "Principal (₹)",
    "default": 100000
  },
  {
    "key": "rate",
    "label": "Rate % p.a.",
    "default": 8
  },
  {
    "key": "years",
    "label": "Years",
    "default": 3
  }
];

export default function SimpleInterestCalculator() {
  return (
    <FinanceCalcShell
      seoKey="simpleInterestCalculator"
      category="banking-tools"
      path="/banking-tools/simple-interest-calculator"
      icon={Percent}
      title="Simple Interest Calculator"
      subtitle="Compute simple interest and total amount."
      fields={fields}
      compute={financeCompute.simple_interest}
    />
  );
}
