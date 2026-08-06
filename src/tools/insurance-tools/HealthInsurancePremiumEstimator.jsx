import { Heart } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "cover",
    "label": "Cover (₹)",
    "default": 1000000
  },
  {
    "key": "age",
    "label": "Oldest member age",
    "default": 35
  },
  {
    "key": "members",
    "label": "Members",
    "default": 3
  }
];

export default function HealthInsurancePremiumEstimator() {
  return (
    <FinanceCalcShell
      seoKey="healthInsurancePremiumEstimator"
      category="insurance-tools"
      path="/insurance-tools/health-insurance-premium-estimator"
      icon={Heart}
      title="Health Insurance Premium Estimator"
      subtitle="Estimate family health insurance premiums."
      fields={fields}
      compute={financeCompute.health_premium}
    />
  );
}
