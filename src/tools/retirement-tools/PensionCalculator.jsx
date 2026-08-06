import { Landmark } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "corpus",
    "label": "Corpus (₹)",
    "default": 5000000
  },
  {
    "key": "rate",
    "label": "Annuity rate % p.a.",
    "default": 6,
    "step": 0.1
  }
];

export default function PensionCalculator() {
  return (
    <FinanceCalcShell
      seoKey="pensionCalculator"
      category="retirement-tools"
      path="/retirement-tools/pension-calculator"
      icon={Landmark}
      title="Pension Calculator"
      subtitle="Estimate pension income from a retirement corpus and annuity rate."
      fields={fields}
      compute={financeCompute.pension}
    />
  );
}
