import { Calculator } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "cost",
    "label": "Asset cost (₹)",
    "default": 500000
  },
  {
    "key": "salvage",
    "label": "Salvage value (₹)",
    "default": 50000
  },
  {
    "key": "years",
    "label": "Useful life (years)",
    "default": 5
  },
  {
    "key": "rate",
    "label": "WDV rate %",
    "default": 15
  },
  {
    "key": "method",
    "label": "Method",
    "type": "select",
    "default": "slm",
    "options": [
      {
        "value": "slm",
        "label": "Straight line"
      },
      {
        "value": "wdv",
        "label": "WDV"
      }
    ]
  }
];

export default function DepreciationCalculator() {
  return (
    <FinanceCalcShell
      seoKey="depreciationCalculator"
      category="business-finance"
      path="/business-finance/depreciation-calculator"
      icon={Calculator}
      title="Depreciation Calculator"
      subtitle="Calculate straight-line or WDV depreciation."
      fields={fields}
      compute={financeCompute.depreciation}
    />
  );
}
