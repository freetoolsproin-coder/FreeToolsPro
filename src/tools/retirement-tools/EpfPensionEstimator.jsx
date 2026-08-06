import { PiggyBank } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "pensionable",
    "label": "Pensionable salary (₹)",
    "default": 15000
  },
  {
    "key": "service",
    "label": "Years of service",
    "default": 20
  }
];

export default function EpfPensionEstimator() {
  return (
    <FinanceCalcShell
      seoKey="epfPensionEstimator"
      category="retirement-tools"
      path="/retirement-tools/epf-pension-estimator"
      icon={PiggyBank}
      title="EPF Pension Estimator"
      subtitle="Estimate EPS pension from pensionable salary and service years."
      fields={fields}
      compute={financeCompute.epf_pension}
    />
  );
}
