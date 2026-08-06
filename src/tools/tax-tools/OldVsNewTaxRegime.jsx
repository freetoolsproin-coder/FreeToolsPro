import { GitCompare } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "income",
    "label": "Gross income (₹)",
    "default": 1500000
  },
  {
    "key": "deductions",
    "label": "Old-regime deductions (₹)",
    "default": 200000
  }
];

export default function OldVsNewTaxRegime() {
  return (
    <FinanceCalcShell
      seoKey="oldVsNewTaxRegime"
      category="tax-tools"
      path="/tax-tools/old-vs-new-tax-regime"
      icon={GitCompare}
      title="Old vs New Tax Regime"
      subtitle="Compare old vs new regime tax side by side."
      fields={fields}
      compute={financeCompute.old_vs_new}
    />
  );
}
