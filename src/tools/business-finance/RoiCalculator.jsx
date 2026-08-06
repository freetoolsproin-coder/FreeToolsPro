import { TrendingUp } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "invest",
    "label": "Investment (₹)",
    "default": 200000
  },
  {
    "key": "gain",
    "label": "Final value / returns (₹)",
    "default": 260000
  }
];

export default function RoiCalculator() {
  return (
    <FinanceCalcShell
      seoKey="roiCalculator"
      category="business-finance"
      path="/business-finance/roi-calculator"
      icon={TrendingUp}
      title="ROI Calculator"
      subtitle="Measure return on investment for a project or campaign."
      fields={fields}
      compute={financeCompute.roi}
    />
  );
}
