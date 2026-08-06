import { CalendarDays } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "basic",
    "label": "Monthly basic (₹)",
    "default": 40000
  },
  {
    "key": "days",
    "label": "Leave days",
    "default": 15
  }
];

export default function LeaveEncashmentCalculator() {
  return (
    <FinanceCalcShell
      seoKey="leaveEncashmentCalculator"
      category="salary-hr"
      path="/salary-hr/leave-encashment-calculator"
      icon={CalendarDays}
      title="Leave Encashment Calculator"
      subtitle="Estimate leave encashment from basic pay and days."
      fields={fields}
      compute={financeCompute.leave_encash}
    />
  );
}
