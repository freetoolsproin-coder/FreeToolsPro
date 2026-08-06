import { useState } from "react";
import { CloudSun } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { CITIES_GEO } from "../../data/india/indiaToolData";

export default function WeatherTool() {
  const [city, setCity] = useState("Mumbai");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const geo = CITIES_GEO[city];
    if (!geo) return;
    setLoading(true);
    setError("");
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather request failed");
      const json = await res.json();
      setData(json.current);
    } catch (e) {
      setError(e.message || "Could not load weather");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo page="weather" />
      <ToolHeroShell
        category="trending-tools"
        icon={CloudSun}
        title="Weather"
        subtitle="Check current weather for Indian cities using Open-Meteo (no API key)."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm text-[var(--ftp-ink-soft)]">City
            <select className={`${selectDark} mt-1.5`} value={city} onChange={(e) => setCity(e.target.value)}>
              {Object.keys(CITIES_GEO).map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <button type="button" onClick={load} className="rounded-[14px] bg-[var(--ftp-ink)] px-5 py-3 text-sm font-semibold text-white">{loading ? "Loading…" : "Get weather"}</button>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        {data ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">Temp</p><p className="mt-1 text-2xl font-semibold">{data.temperature_2m}°C</p></div>
            <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">Humidity</p><p className="mt-1 text-2xl font-semibold">{data.relative_humidity_2m}%</p></div>
            <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">Wind</p><p className="mt-1 text-2xl font-semibold">{data.wind_speed_10m} km/h</p></div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Uses Open-Meteo (free, no key). Click Get weather to fetch the latest reading.</p>
        )}

      </ToolHeroShell>
      <ToolContentLayout category="trending-tools" currentToolPath="/trending-tools/weather" />
    </>
  );
}
