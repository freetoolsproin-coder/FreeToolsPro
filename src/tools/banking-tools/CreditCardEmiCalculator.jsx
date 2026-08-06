import { Wallet } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "amount",
    "label": "Amount (₹)",
    "default": 50000
  },
  {
    "key": "rate",
    "label": "Interest % p.a.",
    "default": 15
  },
  {
    "key": "months",
    "label": "Tenure (months)",
    "default": 12
  }
];

export default function CreditCardEmiCalculator() {
  return (
    <FinanceCalcShell
      seoKey="creditCardEmiCalculator"
      category="banking-tools"
      path="/banking-tools/credit-card-emi-calculator"
      icon={Wallet}
      title="Credit Card EMI Calculator"
      subtitle="Calculate credit card EMI, interest, and total payable."
      fields={fields}
      compute={financeCompute.cc_emi}
    />
  );
}
