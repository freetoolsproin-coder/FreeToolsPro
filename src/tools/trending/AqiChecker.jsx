import { useMemo, useState } from "react";
import { Wind } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { AQI_SAMPLES } from "../../data/india/indiaToolData";

export default function AqiChecker() {
  const [city, setCity] = useState("All");
  const rows = useMemo(() => (city === "All" ? AQI_SAMPLES : AQI_SAMPLES.filter((r) => r.city === city)), [city]);

  return (
    <>
      <Seo page="aqiChecker" />
      <ToolHeroShell
        category="trending-tools"
        icon={Wind}
        title="AQI Checker"
        subtitle="View air quality category guidance and sample city AQI bands for India."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <label className="block text-sm text-[var(--ftp-ink-soft)]">City
          <select className={`${selectDark} mt-1.5 max-w-sm`} value={city} onChange={(e) => setCity(e.target.value)}>
            <option>All</option>
            {AQI_SAMPLES.map((r) => <option key={r.city}>{r.city}</option>)}
          </select>
        </label>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <li key={r.city} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="font-semibold text-[var(--ftp-ink)]">{r.city}</p>
              <p className="mt-2 text-3xl font-semibold">{r.aqi}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">{r.category}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Sample AQI bands for education. Check CPCB / sameer app for official live values.</p>

      </ToolHeroShell>
      <ToolContentLayout category="trending-tools" currentToolPath="/trending-tools/aqi-checker" />
    </>
  );
}
