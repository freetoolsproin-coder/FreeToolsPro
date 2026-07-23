import { useMemo, useState } from "react";
import {
  RefreshCw,
  Layers,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Target,
  Calculator,
  Info,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

const inr = (n, digits = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n || 0);

export default function OptionProfitCalculator() {
  const [optionType, setOptionType] = useState("call");
  const [strike, setStrike] = useState(22000);
  const [premium, setPremium] = useState(150);
  const [underlying, setUnderlying] = useState(22500);
  const [contracts, setContracts] = useState(1);
  const [multiplier, setMultiplier] = useState(50);

  const stats = useMemo(() => {
    const K = parseFloat(strike);
    const prem = parseFloat(premium);
    const S = parseFloat(underlying);
    const qty = parseFloat(contracts);
    const mult = parseFloat(multiplier);

    if (
      !K ||
      K <= 0 ||
      prem < 0 ||
      !Number.isFinite(prem) ||
      !S ||
      S <= 0 ||
      !qty ||
      qty <= 0 ||
      !mult ||
      mult <= 0
    ) {
      return null;
    }

    const intrinsic =
      optionType === "call" ? Math.max(0, S - K) : Math.max(0, K - S);
    const plPerUnit = intrinsic - prem;
    const totalPL = plPerUnit * qty * mult;
    const premiumPaid = prem * qty * mult;
    const breakeven = optionType === "call" ? K + prem : K - prem;

    return {
      intrinsic,
      plPerUnit,
      totalPL,
      premiumPaid,
      breakeven,
      isProfit: totalPL >= 0,
      quantityUnits: qty * mult,
    };
  }, [optionType, strike, premium, underlying, contracts, multiplier]);

  const resetFields = () => {
    setOptionType("call");
    setStrike(22000);
    setPremium(150);
    setUnderlying(22500);
    setContracts(1);
    setMultiplier(50);
  };

  return (
    <>
      <Seo page="optionProfitCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Option Profit Calculator"
        subtitle="Long call / put P/L at expiry (contracts × multiplier)"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        {/* Live form — inputs left, results right */}
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          {/* LEFT: inputs */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Option details</h2>
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
                <p className="mb-2 text-sm font-medium text-slate-600">Option Type</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOptionType("call")}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      optionType === "call"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Call (Long)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptionType("put")}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      optionType === "put"
                        ? "border-rose-300 bg-rose-50 text-rose-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Put (Long)
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="strike"
                    className="flex items-center gap-1 text-sm font-medium text-slate-600"
                  >
                    <Target size={14} className="text-teal-600" /> Strike Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={strike}
                      onChange={(e) => setStrike(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  id="strike"
                  type="range"
                  min="100"
                  max="100000"
                  step="50"
                  value={strike}
                  onChange={(e) => setStrike(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="premium" className="text-sm font-medium text-slate-600">
                    Premium Paid
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={premium}
                      onChange={(e) => setPremium(Number(e.target.value))}
                      className="w-28 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  id="premium"
                  type="range"
                  min="1"
                  max="5000"
                  step="1"
                  value={premium}
                  onChange={(e) => setPremium(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="underlying" className="text-sm font-medium text-slate-600">
                    Underlying at Expiry
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={underlying}
                      onChange={(e) => setUnderlying(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  id="underlying"
                  type="range"
                  min="100"
                  max="100000"
                  step="50"
                  value={underlying}
                  onChange={(e) => setUnderlying(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="contracts" className="text-sm font-medium text-slate-600">
                      Contracts / Lots
                    </label>
                    <span className="text-sm font-bold text-slate-800">{contracts}</span>
                  </div>
                  <input
                    id="contracts"
                    type="number"
                    min="1"
                    value={contracts}
                    onChange={(e) => setContracts(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                  />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="multiplier" className="text-sm font-medium text-slate-600">
                      Lot Multiplier
                    </label>
                    <span className="text-sm font-bold text-slate-800">{multiplier}</span>
                  </div>
                  <input
                    id="multiplier"
                    type="number"
                    min="1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Default multiplier 50 mirrors common India index lot sizing (adjust for the actual
                lot size of your contract).
              </p>
            </div>
          </div>

          {/* RIGHT: results */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-slate-800">P/L at expiry</h2>

            {stats ? (
              <div className="space-y-5">
                <div
                  className={`rounded-2xl border p-5 text-center ${
                    stats.isProfit
                      ? "border-emerald-100/60 bg-gradient-to-br from-emerald-50 to-teal-50"
                      : "border-rose-100/60 bg-gradient-to-br from-rose-50 to-orange-50"
                  }`}
                >
                  <span
                    className={`mb-1 block text-xs font-bold uppercase tracking-widest ${
                      stats.isProfit ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    Net P/L at Expiry
                  </span>
                  <span className="flex items-center justify-center gap-2 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                    {stats.isProfit ? (
                      <TrendingUp className="h-7 w-7 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-7 w-7 text-rose-600" />
                    )}
                    {inr(stats.totalPL, 2)}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stats.quantityUnits.toLocaleString("en-IN")} units ({contracts} × {multiplier})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      <Target size={12} className="text-teal-600" /> Intrinsic
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(stats.intrinsic, 2)}
                    </strong>
                    <span className="mt-0.5 block text-[0.65rem] text-slate-400">per unit</span>
                  </div>

                  <div className="rounded-xl border border-violet-100/50 bg-violet-50/40 p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-violet-600">
                      <CircleDollarSign size={12} /> Premium paid
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(stats.premiumPaid, 2)}
                    </strong>
                    <span className="mt-0.5 block text-[0.65rem] text-violet-500/80">total</span>
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Layers size={14} className="text-amber-600" /> Breakeven at expiry
                    </span>
                    <strong className="text-lg font-black text-teal-700">
                      {inr(stats.breakeven, 2)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-4">
                  <Info size={16} className="mt-0.5 shrink-0 text-teal-600" />
                  <p className="text-xs leading-relaxed text-slate-500">
                    Long {optionType}: P/L = (intrinsic − premium) × contracts × multiplier.
                    Breakeven is strike {optionType === "call" ? "+" : "−"} premium.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <Calculator size={28} className="text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting option inputs</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter strike, premium, and expiry price on the left to see intrinsic value and net
                  P/L.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="calculators"
        currentToolPath="/calculators/option-profit-calculator"
      />
    </>
  );
}
