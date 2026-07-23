import { Calculator } from "lucide-react";
import React, { useState } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import ExploreRelatedTools from "../../components/ExploreRelatedTools";

const DateAddSubtractCalculator = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);
  const [operation, setOperation] = useState("add");
  const [resultDate, setResultDate] = useState("");

  const handleCalculate = () => {
    let date = new Date(startDate);

    if (operation === "add") {
      date.setFullYear(date.getFullYear() + parseInt(years));
      date.setMonth(date.getMonth() + parseInt(months));
      date.setDate(date.getDate() + (parseInt(weeks) * 7) + parseInt(days));
    } else {
      date.setFullYear(date.getFullYear() - parseInt(years));
      date.setMonth(date.getMonth() - parseInt(months));
      date.setDate(date.getDate() - (parseInt(weeks) * 7) - parseInt(days));
    }

    setResultDate(date.toDateString());
  };

  return (
    <>
      <Seo page="dateAddSubtract" />
      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Free Online Date Add/Subtract Calculator"
        subtitle="Add or subtract days, weeks, months, or years from a date"
        formLabel="Calculate"
      >

            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                Date Add/Subtract Calculator
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-slate-900">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="operation" className="block text-sm font-medium text-slate-900">
                    Operation
                  </label>
                  <select
                    id="operation"
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="add">Add</option>
                    <option value="subtract">Subtract</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="years" className="block text-sm font-medium text-slate-900">
                    Years
                  </label>
                  <input
                    type="number"
                    id="years"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="months" className="block text-sm font-medium text-slate-900">
                    Months
                  </label>
                  <input
                    type="number"
                    id="months"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="weeks" className="block text-sm font-medium text-slate-900">
                    Weeks
                  </label>
                  <input
                    type="number"
                    id="weeks"
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="days" className="block text-sm font-medium text-slate-900">
                    Days
                  </label>
                  <input
                    type="number"
                    id="days"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleCalculate}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white btnRegular hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Calculate
                </button>
              </div>
              {resultDate && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h3 className="text-lg font-medium text-slate-900">Result</h3>
                  <p className="text-slate-900">{resultDate}</p>
                </div>
              )}
            </div>
          
      </ToolHeroShell>
      <ToolContentLayout
        category="calculators"
        currentToolPath="/calculators/date-add-subtract-calculator" />
    </>
  );
};

export default DateAddSubtractCalculator;
