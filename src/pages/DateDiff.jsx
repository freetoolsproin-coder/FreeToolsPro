import { useEffect, useState } from "react";
import Seo from "../components/Seo";

// 🔢 Animated counter
function useCounter(value, duration = 500) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16 || 1);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return display;
}

export default function DateDiff() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [days, setDays] = useState(null);
  const [includeEnd, setIncludeEnd] = useState(true);
  const [error, setError] = useState(false);

  // 📆 Auto calculate on change
  useEffect(() => {
    if (!start || !end) return;

    const d1 = new Date(start);
    const d2 = new Date(end);

    if (d1 > d2) {
      setError(true);
      setDays(null);
      return;
    }

    setError(false);

    let diffDays = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
    if (includeEnd) diffDays += 1;

    setDays(diffDays);
  }, [start, end, includeEnd]);

  // 🧮 Working days & leap year count
  const calculateDetails = () => {
    if (!start || !end || days === null) return null;

    let workdays = 0;
    let weekends = 0;
    let leapDays = 0;

    const d = new Date(start);
    const last = new Date(end);

    while (d <= last) {
      const day = d.getDay();
      day === 0 || day === 6 ? weekends++ : workdays++;

      // Leap day check
      if (d.getMonth() === 1 && d.getDate() === 29) leapDays++;

      d.setDate(d.getDate() + 1);
    }

    return { workdays, weekends, leapDays };
  };

  const details = calculateDetails();

  const animatedDays = useCounter(days || 0);

  const setToday = () => setEnd(new Date().toISOString().split("T")[0]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-black px-4">
      <Seo
        title="Advanced Date Difference Calculator"
        description="Calculate days, working days, weekends, leap days between dates."
      />

      <section className={`relative w-full max-w-md rounded-3xl backdrop-blur-xl border p-8 transition ${error ? "bg-red-500/10 border-red-400 shadow-[0_0_40px_rgba(248,113,113,0.6)]" : "bg-white/10 border-white/20 shadow-[0_0_70px_rgba(99,102,241,0.45)]"}`}>
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur opacity-30"></div>

        <div className="relative">
          <h1 className="text-3xl font-extrabold text-center text-white mb-2">📅 Date Difference</h1>
          <p className="text-center text-sm text-white/70 mb-6">Smart • Auto • Timeline Aware</p>

          {/* Start */}
          <label className="text-white/80 text-sm">Start Date</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full mb-4 mt-1 rounded-xl bg-white/20 text-white border border-white/30 px-4 py-3"
          />

          {/* End */}
          <label className="text-white/80 text-sm flex justify-between">
            End Date
            <button onClick={setToday} className="text-xs text-cyan-400">Today</button>
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full mb-3 mt-1 rounded-xl bg-white/20 text-white border border-white/30 px-4 py-3"
          />

          {/* Toggle */}
          <label className="flex items-center gap-2 text-white/80 text-sm mb-4">
            <input type="checkbox" checked={includeEnd} onChange={() => setIncludeEnd(!includeEnd)} />
            Include end date
          </label>

          {/* Error */}
          {error && <p className="text-red-400 text-sm mb-3">End date must be after start date</p>}

          {/* Result */}
          {days !== null && !error && (
            <div className="mt-4 rounded-2xl bg-black/40 border border-white/20 p-5 text-center text-white">
              <p className="text-sm text-white/60">Total Days</p>
              <p className="text-5xl font-extrabold text-green-400">{animatedDays.toFixed(0)}</p>

              {/* Timeline */}
              <div className="relative mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-cyan-400" style={{ width: "100%" }}></div>
              </div>

              {details && (
                <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                  <div className="bg-white/10 rounded-xl p-3"><p className="text-white/60">Workdays</p><p className="font-bold">{details.workdays}</p></div>
                  <div className="bg-white/10 rounded-xl p-3"><p className="text-white/60">Weekends</p><p className="font-bold">{details.weekends}</p></div>
                  <div className="bg-white/10 rounded-xl p-3"><p className="text-white/60">Leap Days</p><p className="font-bold">{details.leapDays}</p></div>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-white/60 mt-6">✨ Auto-calc • Timeline • Leap-year aware</p>
        </div>
      </section>
    </main>
  );
}
