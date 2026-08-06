import { Wallet } from "lucide-react";
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

export default function PersonalLoanCalculator() {
  return (
    <FinanceCalcShell
      seoKey="personalLoanCalculator"
      category="loan-calculators"
      path="/loan-calculators/personal-loan-calculator"
      icon={Wallet}
      title="Personal Loan Calculator"
      subtitle="Calculate personal loan EMI and interest cost."
      fields={fields}
      compute={financeCompute.loan_emi}
    />
  );
}
