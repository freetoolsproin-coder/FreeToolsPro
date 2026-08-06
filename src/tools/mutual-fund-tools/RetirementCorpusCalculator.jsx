import { Home } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "expense",
    "label": "Monthly expense today (₹)",
    "default": 50000
  },
  {
    "key": "years",
    "label": "Years to retire",
    "default": 20
  },
  {
    "key": "inflation",
    "label": "Inflation %",
    "default": 6
  },
  {
    "key": "returnRate",
    "label": "Post-retire return %",
    "default": 7
  }
];

export default function RetirementCorpusCalculator() {
  return (
    <FinanceCalcShell
      seoKey="retirementCorpusCalculator"
      category="mutual-fund-tools"
      path="/mutual-fund-tools/retirement-corpus-calculator"
      icon={Home}
      title="Retirement Corpus Calculator"
      subtitle="Estimate the corpus needed for retirement expenses."
      fields={fields}
      compute={financeCompute.retirement_corpus}
    />
  );
}
