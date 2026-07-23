import { Code2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

// 🔢 Smooth Animated Counter Hook
function useCounter(value, duration = 400) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = display;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setDisplay(Math.floor(progress * (value - startValue) + startValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return display;
}

export default function DateDiff() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [includeEnd, setIncludeEnd] = useState(true);

  // 🗓️ Fast validation and core day difference calculation
  const { totalDays, error, isCalculated } = useMemo(() => {
    if (!start || !end) return { totalDays: 0, error: false, isCalculated: false };

    const d1 = new Date(start);
    const d2 = new Date(end);

    if (d1 > d2) return { totalDays: 0, error: true, isCalculated: false };

    let diffDays = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
    if (includeEnd) diffDays += 1;

    return { totalDays: diffDays, error: false, isCalculated: true };
  }, [start, end, includeEnd]);

  // 🧮 Advanced Breakdown (Years, Months, Workdays, Leap Days)
  const details = useMemo(() => {
    if (!isCalculated || error) return null;

    const d1 = new Date(start);
    const d2 = new Date(end);
    if (includeEnd) d2.setDate(d2.getDate() + 1);

    let workdays = 0;
    let weekends = 0;
    let leapDays = 0;

    // Fast calendar math loop
    const tempDate = new Date(d1);
    while (tempDate < d2) {
      const day = tempDate.getDay();
      if (day === 0 || day === 6) {
        weekends++;
      } else {
        workdays++;
      }
      if (tempDate.getMonth() === 1 && tempDate.getDate() === 29) {
        leapDays++;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    // Advanced Calendar Breakdown (Y/M/D Format)
    let y1 = d1.getFullYear();
    let m1 = d1.getMonth();
    let ed1 = d1.getDate();

    let y2 = d2.getFullYear();
    let m2 = d2.getMonth();
    let ed2 = d2.getDate();

    let years = y2 - y1;
    let months = m2 - m1;
    let days = ed2 - ed1;

    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonth = new Date(y2, m2, 0).getDate();
      days += prevMonth;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { workdays, weekends, leapDays, years, months, days };
  }, [start, end, includeEnd, isCalculated, error]);

  const animatedDays = useCounter(totalDays);

  // ⚡ Shortcuts
  const setToday = (target) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (target === "start") setStart(todayStr);
    if (target === "end") setEnd(todayStr);
  };

  return (
    <>
      <Seo page="dateDifference" />

      <ToolHeroShell
        category="developer-tools"
        icon={Code2}
        title="Date Difference"
        subtitle="Smart • Auto • Timeline Aware"
        formLabel="Start here"
      >
<div className="p-2 sm:p-4 mt-4 bg-white rounded-2xl">
            <div className="space-y-2">
              {/* Start Date input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-black">Start Date</label>
                  <button
                    onClick={() => setToday("start")}
                    className="text-xs text-black hover:underline"
                  >
                    Set Today
                  </button>
                </div>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full rounded-xl bg-black/20 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* End Date input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-black">End Date</label>
                  <button
                    onClick={() => setToday("end")}
                    className="text-xs text-black hover:underline"
                  >
                    Set Today
                  </button>
                </div>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full rounded-xl bg-black/20 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Config Checkbox */}
              <div className="flex justify-center py-2">
                <label className="flex gap-2 items-center cursor-pointer select-none text-sm text-black">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-black"
                    checked={includeEnd}
                    onChange={() => setIncludeEnd(!includeEnd)}
                  />
                  Include End Date (Adds 1 day)
                </label>
              </div>

              {/* Error Box */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm text-center">
                  ⚠️ End date must be after or equal to start date.
                </div>
              )}

              {/* Results Area */}
              {isCalculated && !error && (
                <div className="mt-2 space-y-4 pt-2 border-t border-white/10">
                  {/* Big Number Summary */}
                  <div className="text-center bg-white/5 rounded-2xl p-4">
                    <div className="text-sm text-gray-800 uppercase tracking-wider font-semibold">
                      Total Time Span
                    </div>
                    <div className="text-6xl font-extrabold text-green-400 my-1">
                      {animatedDays}
                    </div>
                    <div className="text-sm text-black font-medium">days total</div>
                  </div>

                  {/* Advanced breakdown description (Years, Months, Days) */}
                  {details && (details.years > 0 || details.months > 0 || details.days > 0) && (
                    <div className="text-center text-sm text-black bg-cyan-500/80 border border-cyan-500/20 rounded-xl py-2 px-3">
                      Equivalent to:{" "}
                      <span className="font-bold text-black">
                        {details.years > 0
                          ? `${details.years} year${details.years > 1 ? "s" : ""}, `
                          : ""}
                        {details.months > 0
                          ? `${details.months} month${details.months > 1 ? "s" : ""}, `
                          : ""}
                        {details.days > 0
                          ? `${details.days} day${details.days > 1 ? "s" : ""}`
                          : ""}
                      </span>
                    </div>
                  )}

                  {/* Dynamic Gradient Bar */}
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-cyan-400 w-full"></div>
                  </div>

                  {/* Detailed Metric Cards */}
                  {details && (
                    <div className="grid grid-cols-3 gap-3 text-center text-sm md:text-sm">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-gray-800 mb-1">Workdays</p>
                        <p className="font-bold text-2xl text-green-400">{details.workdays}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-gray-800 mb-1">Weekends</p>
                        <p className="font-bold text-2xl text-green-400">{details.weekends}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <p className="text-gray-800 mb-1">Leap Days</p>
                        <p className="font-bold text-2xl text-green-400">{details.leapDays}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
      </ToolHeroShell>

      {/* CONTENT */}
      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/date-diff" />
    </>
  );
}
