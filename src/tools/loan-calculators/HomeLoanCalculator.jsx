import { Home } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "amount",
    "label": "Loan amount (₹)",
    "default": 2500000
  },
  {
    "key": "rate",
    "label": "Interest % p.a.",
    "default": 8.5,
    "step": 0.05
  },
  {
    "key": "years",
    "label": "Tenure (years)",
    "default": 20
  }
];

export default function HomeLoanCalculator() {
  return (
    <FinanceCalcShell
      seoKey="homeLoanCalculator"
      category="loan-calculators"
      path="/loan-calculators/home-loan-calculator"
      icon={Home}
      title="Home Loan Calculator"
      subtitle="Calculate home loan EMI, interest, and total payout."
      fields={fields}
      compute={financeCompute.loan_emi}
    />
  );
}
