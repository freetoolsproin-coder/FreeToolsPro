import { ShieldCheck } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "cover",
    "label": "Cover (₹)",
    "default": 10000000
  },
  {
    "key": "age",
    "label": "Age",
    "default": 30
  },
  {
    "key": "years",
    "label": "Policy term (years)",
    "default": 30
  }
];

export default function TermInsuranceCalculator() {
  return (
    <FinanceCalcShell
      seoKey="termInsuranceCalculator"
      category="insurance-tools"
      path="/insurance-tools/term-insurance-calculator"
      icon={ShieldCheck}
      title="Term Insurance Calculator"
      subtitle="Ballpark term life premium from cover, age, and tenure."
      fields={fields}
      compute={financeCompute.term_insurance}
    />
  );
}
