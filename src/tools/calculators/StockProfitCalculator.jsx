import { useMemo, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Percent,
  Layers,
  Calculator,
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

export default function StockProfitCalculator() {
  const [buyPrice, setBuyPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1200);
  const [quantity, setQuantity] = useState(50);
  const [brokeragePercent, setBrokeragePercent] = useState(0.1);

  const stats = useMemo(() => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity);
    const brokeragePct = parseFloat(brokeragePercent);
    const rate = Number.isFinite(brokeragePct) ? brokeragePct : 0.1;

    if (!buy || buy <= 0 || !sell || sell < 0 || !qty || qty <= 0) return null;

    const invested = buy * qty;
    const proceeds = sell * qty;
    const brokerage = ((invested + proceeds) * rate) / 100;
    const netPL = proceeds - invested - brokerage;
    const roi = invested > 0 ? (netPL / invested) * 100 : 0;

    return { invested, proceeds, brokerage, netPL, roi, isProfit: netPL >= 0 };
  }, [buyPrice, sellPrice, quantity, brokeragePercent]);

  const resetFields = () => {
    setBuyPrice(1000);
    setSellPrice(1200);
    setQuantity(50);
    setBrokeragePercent(0.1);
  };

  return (
    <>
      <Seo page="stockProfitCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Stock Profit Calculator"
        subtitle="Calculate net P/L and ROI after brokerage"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Trade details</h2>
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
                    <CircleDollarSign size={14} className="text-teal-600" /> Buy Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value))}
                      className="w-28 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10000"
                  step="1"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <CircleDollarSign size={14} className="text-teal-600" /> Sell Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Number(e.target.value))}
                      className="w-28 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10000"
                  step="1"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Layers size={14} className="text-teal-600" /> Quantity
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-24 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5000"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Percent size={14} className="text-teal-600" /> Brokerage (both sides)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={brokeragePercent}
                      onChange={(e) => setBrokeragePercent(Number(e.target.value))}
                      className="w-20 rounded-xl border border-slate-200 bg-white p-1.5 pr-5 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                    <span className="absolute right-2 top-1.5 text-xs font-semibold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={brokeragePercent}
                  onChange={(e) => setBrokeragePercent(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-slate-800">P/L breakdown</h2>

            {stats ? (
              <div className="space-y-5">
                <div
                  className={`rounded-2xl border p-5 text-center ${
                    stats.isProfit
                      ? "border-teal-100/60 bg-gradient-to-br from-teal-50 to-sky-50"
                      : "border-rose-100/60 bg-gradient-to-br from-rose-50 to-amber-50"
                  }`}
                >
                  <span
                    className={`mb-1 flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-widest ${
                      stats.isProfit ? "text-teal-700" : "text-rose-700"
                    }`}
                  >
                    {stats.isProfit ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    Net Profit / Loss
                  </span>
                  <span
                    className={`text-3xl font-black tracking-tight sm:text-4xl ${
                      stats.isProfit ? "text-slate-800" : "text-rose-700"
                    }`}
                  >
                    {inr(stats.netPL, 2)}
                  </span>
                  <span
                    className={`mt-1 block text-xs font-semibold uppercase tracking-wider ${
                      stats.isProfit ? "text-teal-600" : "text-rose-600"
                    }`}
                  >
                    ROI {stats.roi.toFixed(2)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      Invested amount
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(stats.invested, 2)}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      Sale proceeds
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(stats.proceeds, 2)}
                    </strong>
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total brokerage
                    </span>
                    <strong className="text-lg font-black text-slate-800">
                      {inr(stats.brokerage, 2)}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <Calculator size={28} className="text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting trade inputs</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter buy/sell price, quantity, and brokerage on the left to see net P/L and ROI.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="calculators"
        currentToolPath="/calculators/stock-profit-calculator"
      />
    </>
  );
}
