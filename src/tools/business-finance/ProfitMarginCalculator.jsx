import { Percent } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "cost",
    "label": "Cost (₹)",
    "default": 800
  },
  {
    "key": "price",
    "label": "Selling price (₹)",
    "default": 1000
  }
];

export default function ProfitMarginCalculator() {
  return (
    <FinanceCalcShell
      seoKey="profitMarginCalculator"
      category="business-finance"
      path="/business-finance/profit-margin-calculator"
      icon={Percent}
      title="Profit Margin Calculator"
      subtitle="Calculate profit, margin %, and markup %."
      fields={fields}
      compute={financeCompute.profit_margin}
    />
  );
}
