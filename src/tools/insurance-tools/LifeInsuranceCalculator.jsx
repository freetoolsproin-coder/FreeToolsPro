import { ShieldCheck } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "income",
    "label": "Annual income (₹)",
    "default": 1200000
  },
  {
    "key": "years",
    "label": "Income years to replace",
    "default": 15
  },
  {
    "key": "liabilities",
    "label": "Liabilities (₹)",
    "default": 2000000
  }
];

export default function LifeInsuranceCalculator() {
  return (
    <FinanceCalcShell
      seoKey="lifeInsuranceCalculator"
      category="insurance-tools"
      path="/insurance-tools/life-insurance-calculator"
      icon={ShieldCheck}
      title="Life Insurance Calculator"
      subtitle="Estimate life cover needs from income and liabilities."
      fields={fields}
      compute={financeCompute.life_insurance}
    />
  );
}
