import { Car } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "idv",
    "label": "IDV (₹)",
    "default": 600000
  },
  {
    "key": "rate",
    "label": "OD rate %",
    "default": 1.5,
    "step": 0.1
  },
  {
    "key": "tp",
    "label": "Third-party premium (₹)",
    "default": 3500
  }
];

export default function VehicleInsuranceEstimator() {
  return (
    <FinanceCalcShell
      seoKey="vehicleInsuranceEstimator"
      category="insurance-tools"
      path="/insurance-tools/vehicle-insurance-estimator"
      icon={Car}
      title="Vehicle Insurance Estimator"
      subtitle="Estimate OD + TP vehicle insurance premium."
      fields={fields}
      compute={financeCompute.vehicle_insurance}
    />
  );
}
