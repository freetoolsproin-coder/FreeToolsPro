import { useMemo, useState } from "react";
import { Car } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";


export default function TollCalculatorIndia() {
  const [km, setKm] = useState(120);
  const [plazas, setPlazas] = useState(3);
  const [vehicle, setVehicle] = useState("car");
  const rates = { car: 1.8, lcv: 2.9, bus: 6.2, truck: 7.5 };
  const plazaFee = { car: 85, lcv: 140, bus: 280, truck: 320 };
  const estimate = (Number(km) || 0) * rates[vehicle] + (Number(plazas) || 0) * plazaFee[vehicle];

  return (
    <>
      <Seo page="tollCalculatorIndia" />
      <ToolHeroShell
        category="calculators"
        icon={Car}
        title="Toll Calculator (India)"
        subtitle="Estimate highway toll cost by vehicle class, distance, and plaza count."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Vehicle class
            <select className={`${selectDark} mt-1.5`} value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
              <option value="car">Car / Jeep / Van</option>
              <option value="lcv">LCV</option>
              <option value="bus">Bus</option>
              <option value="truck">Truck</option>
            </select>
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Distance (km)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={km} onChange={(e) => setKm(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Toll plazas
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={plazas} onChange={(e) => setPlazas(e.target.value)} />
          </label>
        </div>
        <p className="mt-6 text-2xl font-semibold text-[var(--ftp-ink)]">Estimated toll ≈ ₹{Math.round(estimate).toLocaleString("en-IN")}</p>
        <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">Heuristic estimate for planning. Actual plaza rates vary by highway, FASTag discounts, and return journey rules.</p>

      </ToolHeroShell>
      <ToolContentLayout category="calculators" currentToolPath="/calculators/toll-calculator-india" />
    </>
  );
}
