import { Wallet } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "ctc",
    "label": "Annual CTC (₹)",
    "default": 1200000
  }
];

export default function InHandSalaryCalculator() {
  return (
    <FinanceCalcShell
      seoKey="inHandSalaryCalculator"
      category="salary-hr"
      path="/salary-hr/in-hand-salary-calculator"
      icon={Wallet}
      title="In-hand Salary Calculator"
      subtitle="Estimate monthly in-hand salary from CTC."
      fields={fields}
      compute={financeCompute.inhand_salary}
    />
  );
}
