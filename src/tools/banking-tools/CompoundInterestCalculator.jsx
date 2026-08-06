import { TrendingUp } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "principal",
    "label": "Principal (₹)",
    "default": 100000
  },
  {
    "key": "rate",
    "label": "Rate % p.a.",
    "default": 8
  },
  {
    "key": "years",
    "label": "Years",
    "default": 5
  },
  {
    "key": "freq",
    "label": "Compounding / year",
    "type": "select",
    "default": "4",
    "options": [
      {
        "value": "1",
        "label": "1"
      },
      {
        "value": "2",
        "label": "2"
      },
      {
        "value": "4",
        "label": "4"
      },
      {
        "value": "12",
        "label": "12"
      }
    ]
  }
];

export default function CompoundInterestCalculator() {
  return (
    <FinanceCalcShell
      seoKey="compoundInterestCalculator"
      category="banking-tools"
      path="/banking-tools/compound-interest-calculator"
      icon={TrendingUp}
      title="Compound Interest Calculator"
      subtitle="Compute compound interest with flexible compounding."
      fields={fields}
      compute={financeCompute.compound_interest}
    />
  );
}
