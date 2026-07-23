import { useMemo, useState } from "react";
import { RefreshCw, TrendingUp, Wallet, CircleDollarSign, Calculator, Percent, Calendar } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const stats = useMemo(() => {
    const P = parseFloat(currentAmount);
    const r = parseFloat(inflationRate) / 100;
    const n = parseInt(years, 10);

    if (!P || P <= 0 || !r || r < 0 || !n || n <= 0) return null;

    const futureValue = P * Math.pow(1 + r, n);
    const purchasingPower = P / Math.pow(1 + r, n);
    const totalInflation = futureValue - P;

    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

    return {
      futureValue: formatter.format(Math.round(futureValue)),
      purchasingPower: formatter.format(Math.round(purchasingPower)),
      totalInflation: formatter.format(Math.round(totalInflation)),
      lossPercent: ((1 - 1 / Math.pow(1 + r, n)) * 100).toFixed(1),
    };
  }, [currentAmount, inflationRate, years]);

  const resetFields = () => {
    setCurrentAmount(100000);
    setInflationRate(6);
    setYears(10);
  };

  return (
    <>
      <Seo page="inflationCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Inflation Calculator"
        subtitle="See how inflation affects your money over time"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Inflation inputs</h2>
              <button
                type="button"
                onClick={resetFields}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <CircleDollarSign size={14} className="text-teal-600" /> Current Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000000"
                  step="1000"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Percent size={14} className="text-teal-600" /> Expected Inflation (p.a.)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="w-20 rounded-xl border border-slate-200 bg-white p-1.5 pr-5 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                    <span className="absolute right-2 top-1.5 text-xs font-semibold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Calendar size={14} className="text-teal-600" /> Time Period
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-20 rounded-xl border border-slate-200 bg-white p-1.5 pr-7 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                    <span className="absolute right-2 top-1.5 text-xs font-semibold text-slate-400">
                      Yrs
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-slate-800">Inflation impact</h2>

            {stats ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-teal-100/60 bg-gradient-to-br from-teal-50 to-sky-50 p-5 text-center">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-teal-700">
                    Future Cost
                  </span>
                  <span className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                    {stats.futureValue}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    After {years} years at {inflationRate}% inflation
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      <Wallet size={12} className="text-teal-600" /> Purchasing power
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {stats.purchasingPower}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-amber-100/50 bg-amber-50/40 p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-amber-600">
                      <TrendingUp size={12} /> Value erosion
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {stats.lossPercent}%
                    </strong>
                    <span className="mt-0.5 block text-xs text-slate-500">{stats.totalInflation}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <Calculator size={28} className="text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting inputs</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter amount, inflation rate, and years on the left to see how purchasing power
                  changes.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent category="calculators" currentToolPath="/calculators/inflation-calculator" />
    </>
  );
}
