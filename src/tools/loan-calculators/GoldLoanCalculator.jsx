import { Coins } from "lucide-react";
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

export default function GoldLoanCalculator() {
  return (
    <FinanceCalcShell
      seoKey="goldLoanCalculator"
      category="loan-calculators"
      path="/loan-calculators/gold-loan-calculator"
      icon={Coins}
      title="Gold Loan Calculator"
      subtitle="Estimate gold loan EMI from amount, rate, and tenure."
      fields={fields}
      compute={financeCompute.loan_emi}
    />
  );
}
