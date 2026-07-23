import { useState, useMemo } from "react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";
import { TrendingUp, Wallet, Award, RefreshCw, Calculator } from "lucide-react";

export default function SipCalculator() {
  // Controlled form states with friendly initial baselines instead of empty fields
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  // 📈 Advanced SIP Multi-Metric Calculation
  const stats = useMemo(() => {
    const P = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const y = parseInt(years);

    if (!P || !annualRate || !y || P <= 0 || annualRate <= 0 || y <= 0) {
      return null;
    }

    const r = annualRate / 100 / 12;
    const n = y * 12;

    // Wealth calculation formula for Future Value of an Annuity Due
    const totalMaturityValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = P * n;
    const estimatedReturns = totalMaturityValue - totalInvested;

    const formatter = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    });

    return {
      investedStr: formatter.format(Math.round(totalInvested)),
      returnsStr: formatter.format(Math.round(estimatedReturns)),
      maturityStr: formatter.format(Math.round(totalMaturityValue)),
      rawInvested: totalInvested,
      rawReturns: estimatedReturns,
    };
  }, [amount, rate, years]);

  const resetFields = () => {
    setAmount(1000);
    setRate(12);
    setYears(5);
  };

  return (
    <>
      <Seo page="sipCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Free Online SIP Calculator"
        subtitle="Estimate your mutual fund returns with our SIP calculator"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          {/* LEFT: inputs */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            {/* Interactive Slider Input Containers */}
            <div className="space-y-6">
              {/* Row 1: Monthly Input Box */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-slate-600">Monthly Investment</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-28 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 inputSlider rounded-lg bg-slate-200 appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Row 2: Rate Input Box */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-slate-600">Expected Return Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
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
                  min="1"
                  max="30"
                  step="0.5"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-2 inputSlider rounded-lg bg-slate-200 appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Row 3: Years Input Box */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-slate-600">
                    Investment Time Horizon
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
                  max="40"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 inputSlider rounded-lg bg-slate-200 appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            </div>

            {/* Reset / Clear Function Action block */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFields}
                className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
              >
                <RefreshCw size={12} /> Reset Parameters
              </button>
            </div>
          </div>

          {/* RIGHT: results */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            {stats ? (
              <div className="space-y-5 animate-fadeIn">
                {/* Milestone Maturity Highlight Callout Box */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 text-center border border-blue-100/40">
                  <span className="text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">
                    Estimated Maturity Worth
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                    ₹{stats.maturityStr}
                  </span>
                </div>

                {/* Sub-Metrics Financial Breakdown Row Split */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-slate-200/60 rounded-xl text-slate-600">
                      <Wallet size={16} />
                    </div>
                    <div>
                      <span className="text-xxs font-bold uppercase tracking-wider text-slate-400 block">
                        Total Invested
                      </span>
                      <strong className="text-base font-bold text-slate-800">
                        ₹{stats.investedStr}
                      </strong>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/40 border border-emerald-100/60 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <span className="text-xxs font-bold uppercase tracking-wider text-emerald-500 block">
                        Wealth Gained
                      </span>
                      <strong className="text-base font-bold text-slate-800">
                        ₹{stats.returnsStr}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 📊 Advanced Value Metric Proportional Stacked Growth bar */}
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      className="h-full bg-slate-300 transition-all duration-500"
                      style={{
                        width: `${(stats.rawInvested / (stats.rawInvested + stats.rawReturns)) * 100}%`,
                      }}
                    />
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${(stats.rawReturns / (stats.rawInvested + stats.rawReturns)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-3xs font-bold uppercase tracking-wider text-slate-400 px-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /> Invested
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Capital
                      Gains
                    </span>
                  </div>
                </div>

                {/* Compound Summary Projections Insights Box */}
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl flex items-start gap-2.5">
                  <Award size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    By strictly compounding{" "}
                    <strong className="text-slate-700">₹{amount.toLocaleString("en-IN")}</strong>{" "}
                    monthly for <strong className="text-slate-700">{years} years</strong> at a
                    estimated compounding baseline of{" "}
                    <strong className="text-slate-700">{rate}%</strong>, your interest capital
                    returns alone account for roughly{" "}
                    <strong className="text-slate-700 font-bold">
                      {Math.round(
                        (stats.rawReturns / (stats.rawInvested + stats.rawReturns)) * 100
                      )}
                      %
                    </strong>{" "}
                    of your total generated maturity net worth.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
                ⚠️ Please adjust inputs to valid ranges.
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

            <ToolPageContent
        category="calculators"
        currentToolPath="/calculators/sip-calculator"
        howTitle="Compound SIP math, zero friction."
        howBody="FreeToolsPro SIP Calculator estimates maturity value from monthly investment, expected return, and tenure—then breaks out total invested vs wealth gained so you can plan retirement, education, or goal-based wealth building with clarity."
        steps={[
          { title: "Set monthly SIP", body: "Choose how much you invest every month." },
          { title: "Add return & tenure", body: "Expected annual return and years drive the compound projection." },
          { title: "Read the corpus", body: "See maturity value, total invested, and estimated gains instantly." },
        ]}
        faqs={[
          { q: "Is this SIP Calculator free?", a: "Yes. Use it unlimited times with no signup or hidden fees." },
          { q: "Does it guarantee returns?", a: "No. Results are estimates based on the return rate you enter; markets vary." },
          { q: "Is my data stored?", a: "No. Calculations run in your browser and stay private." },
          { q: "Can beginners use SIP?", a: "Yes. SIP is one of the simplest ways to start disciplined mutual fund investing." },
        ]}
        trustBullets={[
          "Browser-local SIP math—inputs stay private",
          "Clear invested vs gain breakdown",
          "Mobile-ready for quick planning anywhere",
        ]}
        ctaLabel="Calculate SIP"
        exploreLabel="More calculators from the FreeToolsPro suite."
      />
    </>
  );
}
