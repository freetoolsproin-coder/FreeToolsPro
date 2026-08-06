import { Home } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "basic",
    "label": "Basic salary (₹ / yr)",
    "default": 600000
  },
  {
    "key": "hra",
    "label": "HRA received (₹ / yr)",
    "default": 240000
  },
  {
    "key": "rent",
    "label": "Rent paid (₹ / yr)",
    "default": 300000
  },
  {
    "key": "metro",
    "label": "Metro city?",
    "type": "select",
    "default": "yes",
    "options": [
      {
        "value": "yes",
        "label": "Yes"
      },
      {
        "value": "no",
        "label": "No"
      }
    ]
  }
];

export default function HraCalculator() {
  return (
    <FinanceCalcShell
      seoKey="hraCalculator"
      category="tax-tools"
      path="/tax-tools/hra-calculator"
      icon={Home}
      title="HRA Calculator"
      subtitle="Calculate HRA exemption for metro and non-metro cities."
      fields={fields}
      compute={financeCompute.hra}
    />
  );
}
