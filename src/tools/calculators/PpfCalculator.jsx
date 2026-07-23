import { useMemo, useState } from "react";
import { RefreshCw, PiggyBank, TrendingUp, Landmark, Calculator, Percent, Calendar } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

const DEFAULT_PPF_RATE = 7.1;

export default function PpfCalculator() {
  const [yearlyInvestment, setYearlyInvestment] = useState(150000);
  const [rate, setRate] = useState(DEFAULT_PPF_RATE);
  const [years, setYears] = useState(15);

  const stats = useMemo(() => {
    const P = parseFloat(yearlyInvestment);
    const r = parseFloat(rate) / 100;
    const n = parseInt(years, 10);

    if (!P || P <= 0 || !r || r <= 0 || !n || n <= 0) return null;

    // Future value of annual deposits compounded yearly (end of year deposits)
    let maturity = 0;
    for (let i = 0; i < n; i += 1) {
      maturity = (maturity + P) * (1 + r);
    }

    const invested = P * n;
    const interest = maturity - invested;

    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

    return {
      invested: formatter.format(Math.round(invested)),
      interest: formatter.format(Math.round(interest)),
      maturity: formatter.format(Math.round(maturity)),
    };
  }, [yearlyInvestment, rate, years]);

  const resetFields = () => {
    setYearlyInvestment(150000);
    setRate(DEFAULT_PPF_RATE);
    setYears(15);
  };

  return (
    <>
      <Seo page="ppfCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="PPF Calculator"
        subtitle="Estimate Public Provident Fund maturity value and interest"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">PPF details</h2>
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
                    <PiggyBank size={14} className="text-teal-600" /> Yearly Investment
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={yearlyInvestment}
                      onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="500"
                  max="150000"
                  step="500"
                  value={yearlyInvestment}
                  onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Max annual PPF contribution is currently ₹1,50,000
                </p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Percent size={14} className="text-teal-600" /> Interest Rate (p.a.)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-20 rounded-xl border border-slate-200 bg-white p-1.5 pr-5 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                    <span className="absolute right-2 top-1.5 text-xs font-semibold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Calendar size={14} className="text-teal-600" /> Tenure
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
                  min="15"
                  max="50"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Minimum lock-in is 15 years; extend in 5-year blocks
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-slate-800">Maturity breakdown</h2>

            {stats ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-teal-100/60 bg-gradient-to-br from-teal-50 to-sky-50 p-5 text-center">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-teal-700">
                    Maturity Value
                  </span>
                  <span className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                    {stats.maturity}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    After {years} years at {rate}% p.a.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      <PiggyBank size={12} className="text-teal-600" /> Total invested
                    </span>
                    <strong className="text-base font-bold text-slate-800">{stats.invested}</strong>
                  </div>

                  <div className="rounded-xl border border-violet-100/50 bg-violet-50/40 p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-violet-600">
                      <TrendingUp size={12} /> Total interest
                    </span>
                    <strong className="text-base font-bold text-slate-800">{stats.interest}</strong>
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Landmark size={14} className="text-teal-600" /> Maturity value
                    </span>
                    <strong className="text-lg font-black text-teal-700">{stats.maturity}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <Calculator size={28} className="text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting PPF inputs</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter yearly investment, rate, and tenure on the left to see maturity value and
                  interest.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent category="calculators" currentToolPath="/calculators/ppf-calculator" />
    </>
  );
}
