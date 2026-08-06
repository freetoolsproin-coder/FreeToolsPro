import { Landmark } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "amount",
    "label": "Deposit (₹)",
    "default": 200000
  },
  {
    "key": "rate",
    "label": "Interest % p.a.",
    "default": 6.5,
    "step": 0.05
  },
  {
    "key": "years",
    "label": "Years",
    "default": 3
  },
  {
    "key": "freq",
    "label": "Compounding",
    "type": "select",
    "default": "4",
    "options": [
      {
        "value": "1",
        "label": "Yearly"
      },
      {
        "value": "2",
        "label": "Half-yearly"
      },
      {
        "value": "4",
        "label": "Quarterly"
      }
    ]
  }
];

export default function FdCalculator() {
  return (
    <FinanceCalcShell
      seoKey="fdCalculator"
      category="banking-tools"
      path="/banking-tools/fd-calculator"
      icon={Landmark}
      title="FD Calculator"
      subtitle="Calculate fixed deposit maturity value and interest."
      fields={fields}
      compute={financeCompute.fd}
    />
  );
}
