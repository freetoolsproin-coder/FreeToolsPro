import { Type } from "lucide-react";
import { useState, useEffect } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function DateAddSubtractCalculator() {
  // Safe default initialization using local time string (YYYY-MM-DD)
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getTodayString());
  const [operation, setOperation] = useState("add");
  const [includeStartDay, setIncludeStartDay] = useState(false);
  const [skipWeekends, setSkipWeekends] = useState(false);

  // Individual hooks for robust multi-unit manipulation
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);

  const [result, setResult] = useState("");
  const [formattedResult, setFormattedResult] = useState("");

  // Helper to handle adding business days specifically
  const addBusinessDays = (startDate, totalDays) => {
    let currentDate = new Date(startDate);
    let daysRemaining = Math.abs(totalDays);
    const direction = totalDays >= 0 ? 1 : -1;

    while (daysRemaining > 0) {
      currentDate.setDate(currentDate.getDate() + direction);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // 0 = Sunday, 6 = Saturday
        daysRemaining--;
      }
    }
    return currentDate;
  };

  useEffect(() => {
    if (!date) {
      setResult("");
      setFormattedResult("");
      return;
    }

    // Explode date string to prevent hidden timezone offsets
    const [year, month, day] = date.split("-").map(Number);
    let newDate = new Date(year, month - 1, day);

    const mult = operation === "add" ? 1 : -1;

    // 1. Process Large Units first (Years & Months)
    if (years) newDate.setFullYear(newDate.getFullYear() + Number(years) * mult);
    if (months) newDate.setMonth(newDate.getMonth() + Number(months) * mult);

    // 2. Process Calendar Days & Weeks
    let totalDaysDelta = (Number(days) + Number(weeks) * 7) * mult;

    // 3. Handle Include Start Day toggle
    if (includeStartDay && totalDaysDelta !== 0) {
      // If we are adding days, including the start day means we step 1 less day forward
      totalDaysDelta = totalDaysDelta > 0 ? totalDaysDelta - 1 : totalDaysDelta + 1;
    }

    // 4. Handle Calculations considering Business Days vs Normal Days
    if (skipWeekends && totalDaysDelta !== 0) {
      newDate = addBusinessDays(newDate, totalDaysDelta);
    } else {
      newDate.setDate(newDate.getDate() + totalDaysDelta);
    }

    // Format output variations
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setResult(newDate.toLocaleDateString(undefined, options));
    setFormattedResult(newDate.toISOString().split("T")[0]); // YYYY-MM-DD fallback
  }, [date, operation, years, months, weeks, days, includeStartDay, skipWeekends]);

  // Quick Action Handler
  const applyQuickAction = (daysCount) => {
    setOperation("add");
    setYears(0);
    setMonths(0);
    setWeeks(0);
    setDays(daysCount);
  };

  const handleReset = () => {
    setDate(getTodayString());
    setOperation("add");
    setYears(0);
    setMonths(0);
    setWeeks(0);
    setDays(0);
    setIncludeStartDay(false);
    setSkipWeekends(false);
  };

  return (
    <>
      <Seo page="dateAddSubtract" />

      <ToolHeroShell
        category="text-tools"
        icon={Type}
        title="⏱️ Advanced Date Calculator"
        subtitle="Add or subtract complex timeframes flawlessly"
        formLabel="Start here"
      >
<div className="p-6 space-y-6 bg-white rounded-3xl">
            {/* Step 1: Base Date & Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Operation
                </label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-gray-700"
                >
                  <option value="add">➕ Add Time</option>
                  <option value="subtract">➖ Subtract Time</option>
                </select>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-800 mr-1 font-medium">Quick Presets:</span>
              <button
                onClick={() => applyQuickAction(30)}
                className="text-sm bg-gray-300 hover:bg-blue-50 hover:text-blue-600 font-semibold px-2.5 py-1 rounded-lg transition"
              >
                30 Days
              </button>
              <button
                onClick={() => applyQuickAction(90)}
                className="text-sm bg-gray-300 hover:bg-blue-50 hover:text-blue-600 font-semibold px-2.5 py-1 rounded-lg transition"
              >
                90 Days
              </button>
              <button
                onClick={() => {
                  setDate(getTodayString());
                }}
                className="text-sm text-white bg-gray-50 hover:bg-blue-50 hover:text-blue-600 font-semibold px-2.5 py-1 rounded-lg transition"
              >
                Reset to Today
              </button>
            </div>

            <hr className="border-gray-100" />

            {/* Step 2: Multi-Unit Value Inputs */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                Adjust Interval Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-sm font-medium text-gray-400 block mb-1">Years</span>
                  <input
                    type="number"
                    min="0"
                    value={years || ""}
                    placeholder="0"
                    onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400 block mb-1">Months</span>
                  <input
                    type="number"
                    min="0"
                    value={months || ""}
                    placeholder="0"
                    onChange={(e) => setMonths(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400 block mb-1">Weeks</span>
                  <input
                    type="number"
                    min="0"
                    value={weeks || ""}
                    placeholder="0"
                    onChange={(e) => setWeeks(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400 block mb-1">Days</span>
                  <input
                    type="number"
                    min="0"
                    value={days || ""}
                    placeholder="0"
                    onChange={(e) => setDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Modifiers / Toggles */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeStartDay}
                  onChange={(e) => setIncludeStartDay(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700">Include starting day in calculation</p>
                  <p className="text-sm text-gray-400">Counts the initial day as Day 1</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={skipWeekends}
                  onChange={(e) => setSkipWeekends(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-700">Workdays Only (Skip Weekends)</p>
                  <p className="text-sm text-gray-400">
                    Excludes Saturdays and Sundays from day counts
                  </p>
                </div>
              </label>
            </div>

            {/* Result Outputs */}
            {result ? (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center shadow-inner space-y-1">
                <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 block">
                  Calculated Result Date
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-800 transition-all">
                  {result}
                </div>
                <div className="text-sm text-emerald-600/80 font-mono pt-1">
                  ISO Format: {formattedResult}
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-400 bg-gray-50 border border-dashed border-gray-200 p-5 rounded-2xl">
                Please enter a valid start date.
              </div>
            )}

            {/* Clear Filters / Global Reset */}
            <div className="text-center pt-2">
              <button
                onClick={handleReset}
                className="text-sm font-semibold btnRegular text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
              >
                Clear All Inputs
              </button>
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="text-tools"
        currentToolPath="/text-tools/date-add-subtract-calculator" />
    </>
  );
}
