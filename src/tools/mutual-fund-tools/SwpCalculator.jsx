import { Wallet } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "corpus",
    "label": "Starting corpus (₹)",
    "default": 5000000
  },
  {
    "key": "withdrawal",
    "label": "Monthly withdrawal (₹)",
    "default": 30000
  },
  {
    "key": "rate",
    "label": "Expected return % p.a.",
    "default": 8
  }
];

export default function SwpCalculator() {
  return (
    <FinanceCalcShell
      seoKey="swpCalculator"
      category="mutual-fund-tools"
      path="/mutual-fund-tools/swp-calculator"
      icon={Wallet}
      title="SWP Calculator"
      subtitle="Estimate how long a systematic withdrawal lasts."
      fields={fields}
      compute={financeCompute.swp}
    />
  );
}
