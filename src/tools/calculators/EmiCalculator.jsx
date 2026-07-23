import { useState, useMemo } from "react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";
import { CreditCard, Calendar, Percent, RefreshCw, Info, Calculator } from "lucide-react";

export default function EmiCalculator() {
  // Controlled baseline inputs for instant visual feedback on render
  const [amount, setAmount] = useState(500000); // 5 Lakhs default
  const [rate, setRate] = useState(9.5); // 9.5% average interest default
  const [years, setYears] = useState(5); // 5 years default

  // 💰 Comprehensive EMI Analytics Engine
  const loanStats = useMemo(() => {
    const P = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const tYears = parseFloat(years);

    if (!P || !annualRate || !tYears || P <= 0 || annualRate <= 0 || tYears <= 0) {
      return null;
    }

    const r = annualRate / 12 / 100; // Monthly interest rate
    const n = tYears * 12; // Total monthly tenure periods

    // Standard Amortization Formula
    const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalPayment = emiValue * n;
    const totalInterest = totalPayment - P;

    const formatter = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    });

    let balance = P;
    const schedule = [];
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principalPaid = emiValue - interest;
      balance -= principalPaid;
      schedule.push({
        month: i,
        principal: Math.round(principalPaid),
        interest: Math.round(interest),
        balance: Math.max(Math.round(balance), 0),
      });
    }

    return {
      emiStr: formatter.format(Math.round(emiValue)),
      principalStr: formatter.format(Math.round(P)),
      interestStr: formatter.format(Math.round(totalInterest)),
      totalPaymentStr: formatter.format(Math.round(totalPayment)),
      rawPrincipal: P,
      rawInterest: totalInterest,
      rawTotal: totalPayment,
      schedule,
    };
  }, [amount, rate, years]);

  const resetFields = () => {
    setAmount(100000);
    setRate(8.5);
    setYears(3);
  };

  return (
    <>
      <Seo page="emiCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Free Online EMI Calculator"
        subtitle="Calculate EMI, total interest, and a full month-by-month amortization schedule"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        {/* Live form — inputs left, results right */}
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          {/* LEFT: inputs */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Loan details</h2>
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
                    <CreditCard size={14} className="text-teal-600" /> Loan Principal
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-32 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
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
                  max="25"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
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

          {/* RIGHT: results */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-lg font-bold text-slate-800">EMI breakdown</h2>

            {loanStats ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-teal-100/60 bg-gradient-to-br from-teal-50 to-sky-50 p-5 text-center">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-teal-700">
                    Equated Monthly Installment (EMI)
                  </span>
                  <span className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                    ₹{loanStats.emiStr}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Due monthly for {years * 12} installments
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                      Principal borrowed
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      ₹{loanStats.principalStr}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-violet-100/50 bg-violet-50/40 p-4">
                    <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-wider text-violet-600">
                      Total interest
                    </span>
                    <strong className="text-base font-bold text-slate-800">
                      ₹{loanStats.interestStr}
                    </strong>
                  </div>

                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total cost (P + I)
                    </span>
                    <strong className="text-lg font-black text-teal-700">
                      ₹{loanStats.totalPaymentStr}
                    </strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-teal-500 transition-all duration-500"
                      style={{ width: `${(loanStats.rawPrincipal / loanStats.rawTotal) * 100}%` }}
                    />
                    <div
                      className="h-full bg-violet-400 transition-all duration-500"
                      style={{ width: `${(loanStats.rawInterest / loanStats.rawTotal) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between px-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-teal-500" /> Principal (
                      {Math.round((loanStats.rawPrincipal / loanStats.rawTotal) * 100)}%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-violet-400" /> Interest (
                      {Math.round((loanStats.rawInterest / loanStats.rawTotal) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-4">
                  <Info size={16} className="mt-0.5 shrink-0 text-teal-600" />
                  <p className="text-xs leading-relaxed text-slate-500">
                    Your total interest over the loan term is{" "}
                    <strong className="font-semibold text-violet-700">₹{loanStats.interestStr}</strong>
                    . Occasional prepayments can shorten tenure and cut interest.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <p className="border-b border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Amortization schedule
                  </p>
                  <div className="max-h-72 overflow-auto">
                    <table className="min-w-full text-left text-xs sm:text-sm">
                      <thead className="sticky top-0 bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Month</th>
                          <th className="px-3 py-2 font-semibold">Principal</th>
                          <th className="px-3 py-2 font-semibold">Interest</th>
                          <th className="px-3 py-2 font-semibold">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        {loanStats.schedule.map((row) => (
                          <tr key={row.month} className="border-t border-slate-100">
                            <td className="px-3 py-1.5">{row.month}</td>
                            <td className="px-3 py-1.5">
                              ₹{row.principal.toLocaleString("en-IN")}
                            </td>
                            <td className="px-3 py-1.5">
                              ₹{row.interest.toLocaleString("en-IN")}
                            </td>
                            <td className="px-3 py-1.5">
                              ₹{row.balance.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-teal-100 bg-teal-50">
                  <Calculator size={28} className="text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">Awaiting loan inputs</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                  Enter principal, rate, and tenure on the left to see your EMI and full repayment
                  breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="calculators"
        currentToolPath="/calculators/emi-calculator"
        howTitle="Bank-formula EMI, instantly clear."
        howBody="FreeToolsPro EMI Calculator turns loan amount, interest rate, and tenure into monthly EMI, total interest, overall repayment, and a full amortization schedule—using the same reducing-balance math banks rely on."
        steps={[
          { title: "Enter loan amount", body: "Set the principal you plan to borrow." },
          { title: "Set rate & tenure", body: "Annual interest and years define monthly installments." },
          { title: "Review EMI and schedule", body: "See totals plus each month’s principal, interest, and remaining balance." },
        ]}
        faqs={[
          { q: "Which formula does it use?", a: "The standard reducing-balance EMI formula used by banks and NBFCs." },
          { q: "Does it include an amortization table?", a: "Yes. After EMI totals, scroll the month-by-month schedule of principal, interest, and balance." },
          { q: "Does it store loan details?", a: "No. Everything is calculated locally in your browser." },
          { q: "Can I model prepayments?", a: "Use different tenure and principal scenarios to approximate the impact of paying down faster." },
        ]}
        trustBullets={[
          "Standard bank EMI amortization",
          "Full month-by-month schedule",
          "Private local calculations",
        ]}
        ctaLabel="Calculate EMI"
        exploreLabel="More calculators from the FreeToolsPro suite."
      />
    </>
  );
}
