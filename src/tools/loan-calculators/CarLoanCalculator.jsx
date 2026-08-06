import { Car } from "lucide-react";
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

export default function CarLoanCalculator() {
  return (
    <FinanceCalcShell
      seoKey="carLoanCalculator"
      category="loan-calculators"
      path="/loan-calculators/car-loan-calculator"
      icon={Car}
      title="Car Loan Calculator"
      subtitle="Calculate car loan EMI and total interest."
      fields={fields}
      compute={financeCompute.loan_emi}
    />
  );
}
