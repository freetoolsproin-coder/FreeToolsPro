import { Wallet } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "balance",
    "label": "Average balance (₹)",
    "default": 150000
  },
  {
    "key": "rate",
    "label": "Interest % p.a.",
    "default": 3
  },
  {
    "key": "days",
    "label": "Days",
    "default": 30
  }
];

export default function SavingsInterestCalculator() {
  return (
    <FinanceCalcShell
      seoKey="savingsInterestCalculator"
      category="banking-tools"
      path="/banking-tools/savings-interest-calculator"
      icon={Wallet}
      title="Savings Interest Calculator"
      subtitle="Estimate savings-account interest for a period."
      fields={fields}
      compute={financeCompute.savings_interest}
    />
  );
}
