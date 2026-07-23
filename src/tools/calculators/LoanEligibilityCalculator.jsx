import { useMemo, useState } from "react";
import {
  RefreshCw,
  BadgeCheck,
  Wallet,
  Percent,
  Calendar,
  Landmark,
  CircleAlert,
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

export default function LoanEligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(80000);
  const [existingEmis, setExistingEmis] = useState(10000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [desiredLoan, setDesiredLoan] = useState(2500000);

  const stats = useMemo(() => {
    const income = parseFloat(monthlyIncome);
    const existing = parseFloat(existingEmis) || 0;
    const annualRate = parseFloat(interestRate);
    const years = parseFloat(tenureYears);
    const desired = parseFloat(desiredLoan) || 0;

    if (!income || income <= 0 || !annualRate || annualRate <= 0 || !years || years <= 0) {
      return null;
    }

    const maxEmi = income * 0.5 - existing;
    if (maxEmi <= 0) {
      return {
        maxEmi: 0,
        eligibleAmount: 0,
        desired,
        isEligible: false,
        insufficientCapacity: true,
      };
    }

    const r = annualRate / 12 / 100;
    const n = years * 12;
    const eligibleAmount =
      r === 0
        ? maxEmi * n
        : (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));

    return {
      maxEmi,
      eligibleAmount,
      desired,
      isEligible: desired > 0 && desired <= eligibleAmount,
      insufficientCapacity: false,
    };
  }, [monthlyIncome, existingEmis, interestRate, tenureYears, desiredLoan]);

  const resetFields = () => {
    setMonthlyIncome(80000);
    setExistingEmis(10000);
    setInterestRate(9.5);
    setTenureYears(20);
    setDesiredLoan(2500000);
  };

  return (
    <>
      <Seo page="loanEligibilityCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Loan Eligibility Calculator"
        subtitle="Estimate how much loan you can afford based on income and FOIR"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Income & loan details</h2>
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
                    <Wallet size={14} className="text-teal-600" /> Monthly Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="500000"
                  step="1000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Landmark size={14} className="text-teal-600" /> Existing EMIs
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={existingEmis}
                      onChange={(e) => setExistingEmis(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="500"
                  value={existingEmis}
                  onChange={(e) => setExistingEmis(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
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
                  max="24"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
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
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
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
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <BadgeCheck size={14} className="text-teal-600" /> Desired Loan Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={desiredLoan}
                      onChange={(e) => setDesiredLoan(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="20000000"
                  step="50000"
                  value={desiredLoan}
                  onChange={(e) => setDesiredLoan(Number(e.target.value))}
                  className="inputSlider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-slate-800">Eligibility result</h2>

            {stats ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-teal-100/60 bg-gradient-to-br from-teal-50 to-sky-50 p-5 text-center">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-teal-700">
                    Eligible Loan Amount
                  </span>
                  <span className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                    {inr(stats.eligibleAmount)}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Based on 50% FOIR after existing EMIs
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      Max affordable EMI
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {inr(stats.maxEmi)}
                    </strong>
                  </div>

                  <div
                    className={`rounded-xl border p-4 ${
                      stats.insufficientCapacity || !stats.isEligible
                        ? "border-amber-100/50 bg-amber-50/40"
                        : "border-emerald-100/50 bg-emerald-50/40"
                    }`}
                  >
                    <span
                      className={`mb-0.5 flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider ${
                        stats.insufficientCapacity || !stats.isEligible
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {stats.insufficientCapacity || !stats.isEligible ? (
                        <CircleAlert size={12} />
                      ) : (
                        <BadgeCheck size={12} />
                      )}
                      Desired loan
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      {stats.insufficientCapacity
                        ? "No capacity"
                        : stats.isEligible
                          ? "Eligible"
                          : "Not eligible"}
                    </strong>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-500">
                  Assumes FOIR of 50% of monthly income after existing EMIs. Actual bank eligibility
                  may also depend on credit score, employer, and LTV norms.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <Calculator size={28} className="text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting income inputs</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter income, EMIs, rate, and tenure on the left to estimate how much you can
                  borrow.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="calculators"
        currentToolPath="/calculators/loan-eligibility-calculator"
      />
    </>
  );
}
