import { ListOrdered } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "ctc",
    "label": "Annual CTC (₹)",
    "default": 1200000
  }
];

export default function SalaryBreakupCalculator() {
  return (
    <FinanceCalcShell
      seoKey="salaryBreakupCalculator"
      category="salary-hr"
      path="/salary-hr/salary-breakup-calculator"
      icon={ListOrdered}
      title="Salary Breakup Calculator"
      subtitle="View an illustrative monthly salary breakup."
      fields={fields}
      compute={financeCompute.ctc_breakup}
    />
  );
}
