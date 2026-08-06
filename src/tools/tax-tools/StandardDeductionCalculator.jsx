import { FileText } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "income",
    "label": "Salary income (₹)",
    "default": 1000000
  },
  {
    "key": "regime",
    "label": "Regime",
    "type": "select",
    "default": "new",
    "options": [
      {
        "value": "new",
        "label": "New"
      },
      {
        "value": "old",
        "label": "Old"
      }
    ]
  }
];

export default function StandardDeductionCalculator() {
  return (
    <FinanceCalcShell
      seoKey="standardDeductionCalculator"
      category="tax-tools"
      path="/tax-tools/standard-deduction-calculator"
      icon={FileText}
      title="Standard Deduction Calculator"
      subtitle="Apply salaried standard deduction by regime."
      fields={fields}
      compute={financeCompute.standard_deduction}
    />
  );
}
