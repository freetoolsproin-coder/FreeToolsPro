import { PiggyBank } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "monthly",
    "label": "Monthly contribution (₹)",
    "default": 10000
  },
  {
    "key": "years",
    "label": "Years to retire",
    "default": 25
  },
  {
    "key": "rate",
    "label": "Expected return %",
    "default": 10
  },
  {
    "key": "annuityRate",
    "label": "Annuity rate %",
    "default": 6
  }
];

export default function NpsCalculator() {
  return (
    <FinanceCalcShell
      seoKey="npsCalculator"
      category="retirement-tools"
      path="/retirement-tools/nps-calculator"
      icon={PiggyBank}
      title="NPS Calculator"
      subtitle="Project NPS corpus, lump sum, and annuity pension."
      fields={fields}
      compute={financeCompute.nps}
    />
  );
}
