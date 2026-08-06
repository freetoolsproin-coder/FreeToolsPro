import { useMemo, useState } from "react";
import { Zap } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { POWER_SLABS } from "../../data/india/indiaToolData";

export default function ElectricityBillCalculator() {
  const [state, setState] = useState("Maharashtra");
  const [units, setUnits] = useState(250);
  const [fixed, setFixed] = useState(120);
  const bill = useMemo(() => {
    const slabs = POWER_SLABS[state] || [];
    let remaining = Number(units) || 0;
    let prev = 0;
    let energy = 0;
    for (const slab of slabs) {
      const span = Math.min(remaining, slab.upto - prev);
      if (span <= 0) break;
      energy += span * slab.rate;
      remaining -= span;
      prev = slab.upto;
      if (!Number.isFinite(slab.upto)) break;
    }
    const total = energy + (Number(fixed) || 0);
    return { energy, total };
  }, [state, units, fixed]);

  return (
    <>
      <Seo page="electricityBillCalculator" />
      <ToolHeroShell
        category="calculators"
        icon={Zap}
        title="Electricity Bill Calculator"
        subtitle="Estimate electricity bill across major Indian state slabs from units consumed."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm text-[var(--ftp-ink-soft)]">State
            <select className={`${selectDark} mt-1.5`} value={state} onChange={(e) => setState(e.target.value)}>
              {Object.keys(POWER_SLABS).map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Units (kWh)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={units} onChange={(e) => setUnits(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Fixed charges (₹)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={fixed} onChange={(e) => setFixed(e.target.value)} />
          </label>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--ftp-ink-soft)]">Energy charge</p>
            <p className="mt-1 text-xl font-semibold">₹{Math.round(bill.energy).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--ftp-ink-soft)]">Estimated total</p>
            <p className="mt-1 text-xl font-semibold">₹{Math.round(bill.total).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Simplified slabs for estimation. Subsidies, fuel adjustments, and taxes differ by DISCOM.</p>

      </ToolHeroShell>
      <ToolContentLayout category="calculators" currentToolPath="/calculators/electricity-bill-calculator" />
    </>
  );
}
