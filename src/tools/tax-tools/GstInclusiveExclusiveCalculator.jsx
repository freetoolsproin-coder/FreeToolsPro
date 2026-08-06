import { Percent } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "amount",
    "label": "Amount (₹)",
    "default": 10000
  },
  {
    "key": "rate",
    "label": "GST %",
    "default": 18
  },
  {
    "key": "mode",
    "label": "Mode",
    "type": "select",
    "default": "exclusive",
    "options": [
      {
        "value": "exclusive",
        "label": "Exclusive (add GST)"
      },
      {
        "value": "inclusive",
        "label": "Inclusive (extract GST)"
      }
    ]
  }
];

export default function GstInclusiveExclusiveCalculator() {
  return (
    <FinanceCalcShell
      seoKey="gstInclusiveExclusiveCalculator"
      category="tax-tools"
      path="/tax-tools/gst-inclusive-exclusive-calculator"
      icon={Percent}
      title="GST Inclusive/Exclusive Calculator"
      subtitle="Convert between GST-inclusive and exclusive amounts."
      fields={fields}
      compute={financeCompute.gst_calc}
    />
  );
}
