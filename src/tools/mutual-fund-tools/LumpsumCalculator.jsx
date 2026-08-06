import { PiggyBank } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "amount",
    "label": "Investment (₹)",
    "default": 100000
  },
  {
    "key": "rate",
    "label": "Expected return % p.a.",
    "default": 12
  },
  {
    "key": "years",
    "label": "Years",
    "default": 10
  }
];

export default function LumpsumCalculator() {
  return (
    <FinanceCalcShell
      seoKey="lumpsumCalculator"
      category="mutual-fund-tools"
      path="/mutual-fund-tools/lumpsum-calculator"
      icon={PiggyBank}
      title="Lumpsum Calculator"
      subtitle="Project lumpsum mutual fund growth over time."
      fields={fields}
      compute={financeCompute.lumpsum}
    />
  );
}
