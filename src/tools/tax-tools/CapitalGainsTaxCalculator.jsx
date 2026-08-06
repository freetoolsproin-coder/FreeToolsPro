import { LineChart } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "buy",
    "label": "Buy value (₹)",
    "default": 200000
  },
  {
    "key": "sell",
    "label": "Sell value (₹)",
    "default": 350000
  },
  {
    "key": "type",
    "label": "Gain type",
    "type": "select",
    "default": "ltcg_equity",
    "options": [
      {
        "value": "ltcg_equity",
        "label": "LTCG equity"
      },
      {
        "value": "stcg_equity",
        "label": "STCG equity"
      },
      {
        "value": "ltcg_debt",
        "label": "LTCG other/debt"
      },
      {
        "value": "stcg_other",
        "label": "STCG other"
      }
    ]
  }
];

export default function CapitalGainsTaxCalculator() {
  return (
    <FinanceCalcShell
      seoKey="capitalGainsTaxCalculator"
      category="tax-tools"
      path="/tax-tools/capital-gains-tax-calculator"
      icon={LineChart}
      title="Capital Gains Tax Calculator"
      subtitle="Estimate capital gains tax on equity and other assets."
      fields={fields}
      compute={financeCompute.capital_gains}
    />
  );
}
