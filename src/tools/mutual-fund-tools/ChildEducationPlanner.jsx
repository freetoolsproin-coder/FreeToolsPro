import { GraduationCap } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "cost",
    "label": "Today's education cost (₹)",
    "default": 1500000
  },
  {
    "key": "years",
    "label": "Years until needed",
    "default": 12
  },
  {
    "key": "inflation",
    "label": "Education inflation %",
    "default": 8
  },
  {
    "key": "rate",
    "label": "Investment return %",
    "default": 12
  }
];

export default function ChildEducationPlanner() {
  return (
    <FinanceCalcShell
      seoKey="childEducationPlanner"
      category="mutual-fund-tools"
      path="/mutual-fund-tools/child-education-planner"
      icon={GraduationCap}
      title="Child Education Planner"
      subtitle="Plan SIPs for future education costs with inflation."
      fields={fields}
      compute={financeCompute.child_education}
    />
  );
}
