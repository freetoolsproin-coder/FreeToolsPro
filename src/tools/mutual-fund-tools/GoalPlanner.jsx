import { Target } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "goal",
    "label": "Goal amount (₹)",
    "default": 2000000
  },
  {
    "key": "years",
    "label": "Years",
    "default": 8
  },
  {
    "key": "rate",
    "label": "Expected return % p.a.",
    "default": 12
  }
];

export default function GoalPlanner() {
  return (
    <FinanceCalcShell
      seoKey="goalPlanner"
      category="mutual-fund-tools"
      path="/mutual-fund-tools/goal-planner"
      icon={Target}
      title="Goal Planner"
      subtitle="Find the SIP needed to reach a financial goal."
      fields={fields}
      compute={financeCompute.goal_planner}
    />
  );
}
