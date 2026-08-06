import { Wallet } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "balance",
    "label": "Card balance (₹)",
    "default": 80000
  },
  {
    "key": "apr",
    "label": "APR %",
    "default": 36
  },
  {
    "key": "payment",
    "label": "Monthly payment (₹)",
    "default": 8000
  }
];

export default function CreditCardPayoffCalculator() {
  return (
    <FinanceCalcShell
      seoKey="creditCardPayoffCalculator"
      category="banking-tools"
      path="/banking-tools/credit-card-payoff-calculator"
      icon={Wallet}
      title="Credit Card Payoff Calculator"
      subtitle="Estimate months to pay off a credit card balance."
      fields={fields}
      compute={financeCompute.cc_payoff}
    />
  );
}
