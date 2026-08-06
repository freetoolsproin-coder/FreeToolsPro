import { GraduationCap } from "lucide-react";
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

export default function EducationLoanCalculator() {
  return (
    <FinanceCalcShell
      seoKey="educationLoanCalculator"
      category="loan-calculators"
      path="/loan-calculators/education-loan-calculator"
      icon={GraduationCap}
      title="Education Loan Calculator"
      subtitle="Calculate education loan EMI and total payment."
      fields={fields}
      compute={financeCompute.loan_emi}
    />
  );
}
