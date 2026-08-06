import { ReceiptIndianRupee } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "income",
    "label": "Taxable income (₹)",
    "default": 1200000
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
  },
  {
    "key": "deductions",
    "label": "Deductions (old regime)",
    "default": 150000
  }
];

export default function IncomeTaxCalculator() {
  return (
    <FinanceCalcShell
      seoKey="incomeTaxCalculator"
      category="tax-tools"
      path="/tax-tools/income-tax-calculator"
      icon={ReceiptIndianRupee}
      title="Income Tax Calculator"
      subtitle="Estimate Indian income tax under old or new regime."
      fields={fields}
      compute={financeCompute.income_tax}
    />
  );
}
