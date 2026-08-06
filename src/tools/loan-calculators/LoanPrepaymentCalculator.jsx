import { BadgeIndianRupee } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "amount",
    "label": "Outstanding (₹)",
    "default": 2000000
  },
  {
    "key": "rate",
    "label": "Interest % p.a.",
    "default": 9
  },
  {
    "key": "years",
    "label": "Remaining years",
    "default": 15
  },
  {
    "key": "prepay",
    "label": "Prepayment (₹)",
    "default": 200000
  }
];

export default function LoanPrepaymentCalculator() {
  return (
    <FinanceCalcShell
      seoKey="loanPrepaymentCalculator"
      category="loan-calculators"
      path="/loan-calculators/loan-prepayment-calculator"
      icon={BadgeIndianRupee}
      title="Loan Prepayment Calculator"
      subtitle="See EMI and interest impact of a loan prepayment."
      fields={fields}
      compute={financeCompute.loan_prepay}
    />
  );
}
