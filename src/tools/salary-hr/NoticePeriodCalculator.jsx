import { Clock3 } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "salary",
    "label": "Monthly salary (₹)",
    "default": 60000
  },
  {
    "key": "notice",
    "label": "Notice days",
    "default": 90
  },
  {
    "key": "served",
    "label": "Days served",
    "default": 30
  }
];

export default function NoticePeriodCalculator() {
  return (
    <FinanceCalcShell
      seoKey="noticePeriodCalculator"
      category="salary-hr"
      path="/salary-hr/notice-period-calculator"
      icon={Clock3}
      title="Notice Period Calculator"
      subtitle="Estimate notice buyout for unserved days."
      fields={fields}
      compute={financeCompute.notice_period}
    />
  );
}
