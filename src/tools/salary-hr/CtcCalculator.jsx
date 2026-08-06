import { BriefcaseBusiness } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "ctc",
    "label": "Annual CTC (₹)",
    "default": 1200000
  }
];

export default function CtcCalculator() {
  return (
    <FinanceCalcShell
      seoKey="ctcCalculator"
      category="salary-hr"
      path="/salary-hr/ctc-calculator"
      icon={BriefcaseBusiness}
      title="CTC Calculator"
      subtitle="Break CTC into basic, HRA, and common components."
      fields={fields}
      compute={financeCompute.ctc_breakup}
    />
  );
}
