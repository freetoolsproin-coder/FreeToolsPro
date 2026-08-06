import { Percent } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "corpus",
    "label": "Corpus (₹)",
    "default": 10000000
  },
  {
    "key": "rate",
    "label": "Withdrawal rate %",
    "default": 4,
    "step": 0.25
  }
];

export default function SafeWithdrawalRateCalculator() {
  return (
    <FinanceCalcShell
      seoKey="safeWithdrawalRateCalculator"
      category="retirement-tools"
      path="/retirement-tools/safe-withdrawal-rate-calculator"
      icon={Percent}
      title="Safe Withdrawal Rate Calculator"
      subtitle="Calculate sustainable withdrawal amounts from a corpus."
      fields={fields}
      compute={financeCompute.swr}
    />
  );
}
