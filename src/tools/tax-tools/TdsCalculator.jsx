import { Receipt } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "amount",
    "label": "Payment amount (₹)",
    "default": 100000
  },
  {
    "key": "rate",
    "label": "TDS %",
    "default": 10
  }
];

export default function TdsCalculator() {
  return (
    <FinanceCalcShell
      seoKey="tdsCalculator"
      category="tax-tools"
      path="/tax-tools/tds-calculator"
      icon={Receipt}
      title="TDS Calculator"
      subtitle="Calculate TDS amount and net payable."
      fields={fields}
      compute={financeCompute.tds}
    />
  );
}
