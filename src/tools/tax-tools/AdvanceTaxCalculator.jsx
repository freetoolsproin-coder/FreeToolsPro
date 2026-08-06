import { CalendarDays } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "tax",
    "label": "Estimated annual tax (₹)",
    "default": 200000
  }
];

export default function AdvanceTaxCalculator() {
  return (
    <FinanceCalcShell
      seoKey="advanceTaxCalculator"
      category="tax-tools"
      path="/tax-tools/advance-tax-calculator"
      icon={CalendarDays}
      title="Advance Tax Calculator"
      subtitle="Split annual tax into advance-tax installments."
      fields={fields}
      compute={financeCompute.advance_tax}
    />
  );
}
