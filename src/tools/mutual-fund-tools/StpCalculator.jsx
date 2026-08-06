import { ArrowRightLeft } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "fromAmount",
    "label": "Source amount (₹)",
    "default": 500000
  },
  {
    "key": "transfer",
    "label": "Monthly transfer (₹)",
    "default": 20000
  },
  {
    "key": "rate",
    "label": "Dest. return % p.a.",
    "default": 12
  },
  {
    "key": "months",
    "label": "Months",
    "default": 24
  }
];

export default function StpCalculator() {
  return (
    <FinanceCalcShell
      seoKey="stpCalculator"
      category="mutual-fund-tools"
      path="/mutual-fund-tools/stp-calculator"
      icon={ArrowRightLeft}
      title="STP Calculator"
      subtitle="Model systematic transfer plan from one fund to another."
      fields={fields}
      compute={financeCompute.stp}
    />
  );
}
