import { useMemo, useState } from "react";
import {
  RefreshCw,
  Home,
  Percent,
  Calendar,
  CircleDollarSign,
  Wallet,
  Landmark,
  Calculator,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const stats = useMemo(() => {
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment) || 0;
    const annualRate = parseFloat(interestRate);
    const tYears = parseFloat(years);

    if (
      !price ||
      price <= 0 ||
      down < 0 ||
      down >= price ||
      !annualRate ||
      annualRate <= 0 ||
      !tYears ||
      tYears <= 0
    ) {
      return null;
    }

    const loan = price - down;
    const r = annualRate / 12 / 100;
    const n = tYears * 12;
    const emi =
      r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loan;
    const downPercent = (down / price) * 100;

    return { loan, emi, totalPayment, totalInterest, downPercent };
  }, [homePrice, downPayment, interestRate, years]);

  const resetFields = () => {
    setHomePrice(5000000);
    setDownPayment(1000000);
    setInterestRate(8.5);
    setYears(20);
  };

  return (
    <>
      <Seo page="mortgageCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Mortgage Calculator"
        subtitle="Calculate home loan EMI, interest, and total payment"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Mortgage details</h2>
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
                    <Home size={14} className="text-teal-600" /> Home Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="50000"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Wallet size={14} className="text-teal-600" /> Down Payment
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(homePrice - 10000, 0)}
                  step="10000"
                  value={Math.min(downPayment, homePrice)}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
                {stats && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    {stats.downPercent.toFixed(0)}% of home price
                  </p>
                )}
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
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
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
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Calendar size={14} className="text-teal-600" /> Loan Tenure
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
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-slate-800">Mortgage breakdown</h2>

            {stats ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-teal-100/60 bg-gradient-to-br from-teal-50 to-sky-50 p-5 text-center">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-teal-700">
                    Monthly Mortgage EMI
                  </span>
                  <span className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                    {inr(stats.emi)}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Due monthly for {years * 12} installments
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      <Landmark size={12} className="text-teal-600" /> Loan amount
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(stats.loan)}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-violet-100/50 bg-violet-50/40 p-4">
                    <span className="mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-violet-600">
                      <Percent size={12} /> Total interest
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(stats.totalInterest)}
                    </strong>
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <CircleDollarSign size={14} className="text-teal-600" /> Total payment
                    </span>
                    <strong className="text-lg font-black text-teal-700">
                      {inr(stats.totalPayment)}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <Calculator size={28} className="text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting mortgage inputs</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter home price, down payment, rate, and tenure on the left to see EMI and total
                  cost.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent category="calculators" currentToolPath="/calculators/mortgage-calculator" />
    </>
  );
}
