import { useMemo, useState } from "react";
import { RefreshCw, Gift, Wallet, Calendar, CircleDollarSign, Info, Calculator } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

const GRATUITY_CAP = 2000000; // ₹20 lakh private sector statutory cap (indicative)

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));

export default function GratuityCalculator() {
  const [lastDrawnSalary, setLastDrawnSalary] = useState(50000);
  const [yearsOfService, setYearsOfService] = useState(10);

  const stats = useMemo(() => {
    const salary = parseFloat(lastDrawnSalary);
    const years = parseFloat(yearsOfService);

    if (!salary || salary <= 0 || !years || years <= 0) return null;

    // Payment of Gratuity Act: (Last drawn salary × 15 × years) / 26
    const rawGratuity = (salary * 15 * years) / 26;
    const capped = Math.min(rawGratuity, GRATUITY_CAP);
    const isCapped = rawGratuity > GRATUITY_CAP;

    return { rawGratuity, capped, isCapped, years, salary };
  }, [lastDrawnSalary, yearsOfService]);

  const resetFields = () => {
    setLastDrawnSalary(50000);
    setYearsOfService(10);
  };

  return (
    <>
      <Seo page="gratuityCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Gratuity Calculator"
        subtitle="Estimate gratuity under India's Payment of Gratuity Act"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        {/* Live form — inputs left, results right */}
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          {/* LEFT: inputs */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Service details</h2>
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
                  <label
                    htmlFor="last-salary"
                    className="flex items-center gap-1 text-sm font-medium text-slate-600"
                  >
                    <Wallet size={14} className="text-teal-600" /> Last Drawn Basic + DA
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={lastDrawnSalary}
                      onChange={(e) => setLastDrawnSalary(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  id="last-salary"
                  type="range"
                  min="10000"
                  max="500000"
                  step="1000"
                  value={lastDrawnSalary}
                  onChange={(e) => setLastDrawnSalary(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
                <p className="mt-1 text-xs text-slate-400">₹/month</p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="years-service"
                    className="flex items-center gap-1 text-sm font-medium text-slate-600"
                  >
                    <Calendar size={14} className="text-teal-600" /> Years of Service
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={yearsOfService}
                      onChange={(e) => setYearsOfService(Number(e.target.value))}
                      className="w-20 rounded-xl border border-slate-200 bg-white p-1.5 pr-7 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                    <span className="absolute right-2 top-1.5 text-xs font-semibold text-slate-400">
                      Yrs
                    </span>
                  </div>
                </div>
                <input
                  id="years-service"
                  type="range"
                  min="1"
                  max="40"
                  step="0.5"
                  value={yearsOfService}
                  onChange={(e) => setYearsOfService(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: results */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-slate-800">Gratuity estimate</h2>

            {stats ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-teal-100/60 bg-gradient-to-br from-teal-50 to-sky-50 p-5 text-center">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-teal-700">
                    Payable Estimate {stats.isCapped ? "(capped)" : ""}
                  </span>
                  <span className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                    {inr(stats.capped)}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    After {stats.years} years of service
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      <CircleDollarSign size={12} className="text-emerald-600" /> Calculated
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(stats.rawGratuity)}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-violet-100/50 bg-violet-50/40 p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-violet-600">
                      <Gift size={12} /> Cap (₹20L)
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(GRATUITY_CAP)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-4">
                  <Info size={16} className="mt-0.5 shrink-0 text-teal-600" />
                  <p className="text-xs leading-relaxed text-slate-500">
                    Formula: (Last drawn Basic + DA × 15 × years of service) ÷ 26. For many private
                    sector employees, statutory gratuity is capped at ₹20 lakh. Government / some
                    employer policies may differ—confirm with HR or a labour advisor.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <Calculator size={28} className="text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting service inputs</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter last drawn salary and years of service on the left to estimate gratuity.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent category="calculators" currentToolPath="/calculators/gratuity-calculator" />
    </>
  );
}
