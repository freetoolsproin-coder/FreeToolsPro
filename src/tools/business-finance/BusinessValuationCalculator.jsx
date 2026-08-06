import { BriefcaseBusiness } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "earnings",
    "label": "Annual earnings (₹)",
    "default": 5000000
  },
  {
    "key": "multiple",
    "label": "Earnings multiple",
    "default": 8,
    "step": 0.5
  }
];

export default function BusinessValuationCalculator() {
  return (
    <FinanceCalcShell
      seoKey="businessValuationCalculator"
      category="business-finance"
      path="/business-finance/business-valuation-calculator"
      icon={BriefcaseBusiness}
      title="Business Valuation Calculator"
      subtitle="Estimate business value using an earnings multiple."
      fields={fields}
      compute={financeCompute.business_valuation}
    />
  );
}
