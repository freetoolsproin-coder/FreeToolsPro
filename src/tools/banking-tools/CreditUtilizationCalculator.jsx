import { Gauge } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "limit",
    "label": "Credit limit (₹)",
    "default": 200000
  },
  {
    "key": "used",
    "label": "Used credit (₹)",
    "default": 45000
  }
];

export default function CreditUtilizationCalculator() {
  return (
    <FinanceCalcShell
      seoKey="creditUtilizationCalculator"
      category="banking-tools"
      path="/banking-tools/credit-utilization-calculator"
      icon={Gauge}
      title="Credit Utilization Calculator"
      subtitle="Check credit utilization ratio against your limit."
      fields={fields}
      compute={financeCompute.credit_util}
    />
  );
}
