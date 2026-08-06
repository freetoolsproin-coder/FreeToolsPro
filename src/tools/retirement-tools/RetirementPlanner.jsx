import { Home } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "expense",
    "label": "Monthly expense today (₹)",
    "default": 60000
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
    "label": "Return %",
    "default": 10
  },
  {
    "key": "sip",
    "label": "Monthly SIP (₹)",
    "default": 25000
  }
];

export default function RetirementPlanner() {
  return (
    <FinanceCalcShell
      seoKey="retirementPlanner"
      category="retirement-tools"
      path="/retirement-tools/retirement-planner"
      icon={Home}
      title="Retirement Planner"
      subtitle="Compare corpus needed versus SIP accumulation for retirement."
      fields={fields}
      compute={financeCompute.retirement_planner}
    />
  );
}
