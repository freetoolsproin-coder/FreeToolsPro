import { ArrowRightLeft } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = [
  {
    "key": "amount",
    "label": "Outstanding (₹)",
    "default": 3000000
  },
  {
    "key": "oldRate",
    "label": "Current rate %",
    "default": 9.5
  },
  {
    "key": "newRate",
    "label": "New rate %",
    "default": 8.4
  },
  {
    "key": "years",
    "label": "Remaining years",
    "default": 15
  },
  {
    "key": "feePct",
    "label": "Transfer fee %",
    "default": 0.5,
    "step": 0.1
  }
];

export default function BalanceTransferCalculator() {
  return (
    <FinanceCalcShell
      seoKey="balanceTransferCalculator"
      category="loan-calculators"
      path="/loan-calculators/balance-transfer-calculator"
      icon={ArrowRightLeft}
      title="Balance Transfer Calculator"
      subtitle="Compare savings from transferring a loan to a lower rate."
      fields={fields}
      compute={financeCompute.balance_transfer}
    />
  );
}
