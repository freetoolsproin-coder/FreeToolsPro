import { BriefcaseBusiness } from "lucide-react";
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

export default function BusinessLoanCalculator() {
  return (
    <FinanceCalcShell
      seoKey="businessLoanCalculator"
      category="loan-calculators"
      path="/loan-calculators/business-loan-calculator"
      icon={BriefcaseBusiness}
      title="Business Loan Calculator"
      subtitle="Calculate business loan EMI and interest."
      fields={fields}
      compute={financeCompute.loan_emi}
    />
  );
}
