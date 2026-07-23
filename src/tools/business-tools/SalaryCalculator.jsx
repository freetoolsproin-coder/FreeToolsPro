import { useState, useEffect } from "react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";
import {
  IndianRupee,
  Home,
  Landmark,
  Briefcase,
  Download,
  Share2,
  Calculator,
  Sparkles,
  TrendingUp,
  Wallet,
  BadgeIndianRupee,
  Check,
  Info, // Fixed missing import for your UI helper components
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  calculateSalary,
  downloadPDF,
  exportToExcel,
  generateShareLink,
  generateInsights,
} from "../../components/salaryUtils";


export default function SalaryCalculator() {
  const [salary, setSalary] = useState("");
  const [rent, setRent] = useState("");
  const [bonus, setBonus] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [deductions, setDeductions] = useState("150000");

  // Advanced tax variables
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [medInsurance, setMedInsurance] = useState(""); // Section 80D
  const [npsContribution, setNpsContribution] = useState(""); // Section 80CCD(1B)
  const [lta, setLta] = useState(""); // Leave Travel Allowance

  const [isMetro, setIsMetro] = useState(true);
  const [regime, setRegime] = useState("new");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!salary) return;

    // Aggregating all custom deductions for an advanced breakdown
    const totalDeductionsCalculated =
      Number(deductions || 0) + Number(medInsurance || 0) + Number(npsContribution || 0);

    const res = calculateSalary({
      monthlySalary: Number(salary),
      rentPaid: Number(rent || 0),
      bonus: Number(bonus || 0),
      otherIncome: Number(otherIncome || 0),
      isMetro,
      regime,
      deductions: totalDeductionsCalculated,
      lta: Number(lta || 0),
    });

    setResult(res);
  }, [
    salary,
    rent,
    bonus,
    otherIncome,
    deductions,
    medInsurance,
    npsContribution,
    lta,
    isMetro,
    regime,
  ]);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <>
      <Seo page="salaryCalculator" />

      <ToolHeroShell
        category="business-tools"
        icon={Briefcase}
        title="Advanced Salary Calculator"
        subtitle="Calculate in-hand salary, precise income tax, HRA exemptions, deductions across multiple financial acts, and instantly compare tax regimes."
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
{/* MAIN GRID — inputs left, results right */}
          <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
            {/* LEFT SIDE: INPUT FORM */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Calculator className="text-slate-800" />
                  <h2 className="text-xl font-bold text-slate-800">Salary Details</h2>
                </div>
                <span className="text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  FY 2024-25
                </span>
              </div>

              {/* MONTHLY SALARY */}
              <div className="mb-5">
                <label className="block mb-2 text-sm text-slate-700 font-medium">
                  Monthly Base Salary
                </label>
                <div className="relative">
                  <IndianRupee
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-2xl h-14 pl-12 pr-4 text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                    placeholder="50,000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
              </div>

              {/* RENT */}
              <div className="mb-5">
                <label className="block mb-2 text-sm text-slate-700 font-medium">
                  Monthly Rent Paid (For HRA Claims)
                </label>
                <div className="relative">
                  <Home
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-2xl h-14 pl-12 pr-4 text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                    placeholder="15,000"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                  />
                </div>
              </div>

              {/* TWO COLUMN GRID FOR BONUS & OTHER INCOME */}
              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block mb-2 text-sm text-slate-700 font-medium">
                    Annual Variable / Bonus
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
                      size={18}
                    />
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-2xl h-14 pl-12 pr-4 text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                      placeholder="1,00,000"
                      value={bonus}
                      onChange={(e) => setBonus(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-700 font-medium">
                    Other Income (Annual)
                  </label>
                  <div className="relative">
                    <Wallet
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-2xl h-14 pl-12 pr-4 text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                      placeholder="50,000"
                      value={otherIncome}
                      onChange={(e) => setOtherIncome(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* STANDARD DEDUCTIONS */}
              <div className="mb-5">
                <label className="block mb-2 text-sm text-slate-700 font-medium">
                  Standard Deductions (Sec 80C etc.)
                </label>
                <div className="relative">
                  <Landmark
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-2xl h-14 pl-12 pr-4 text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                    placeholder="1,50,000"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                  />
                </div>
              </div>

              {/* ADVANCED TRACKER TOGGLE */}
              <div className="border-t border-white/10 mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-amber-600 hover:text-white transition text-sm font-semibold"
                >
                  <span className="flex items-center gap-2 text-amber-600">
                    <Sparkles size={16} className="text-amber-400" />
                    {showAdvanced
                      ? "Hide Advanced Tax Fields"
                      : "Show Advanced Tax Fields (80D, NPS, LTA)"}
                  </span>
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showAdvanced && (
                  <div className="grid gap-4 mt-4 p-4 rounded-2xl bg-slate-750/200 border border-black/10 transition-all">
                    <div>
                      <label className="block mb-1.5 text-xs text-slate-600">
                        Medical Insurance Premium (Sec 80D) - Max ₹25k/₹50k
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl h-11 px-4 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                        placeholder="e.g. 25000"
                        value={medInsurance}
                        onChange={(e) => setMedInsurance(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 text-xs text-slate-600">
                        National Pension Scheme (Sec 80CCD(1B)) - Max ₹50k
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl h-11 px-4 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                        placeholder="e.g. 50000"
                        value={npsContribution}
                        onChange={(e) => setNpsContribution(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 text-xs text-slate-600">
                        Leave Travel Allowance (LTA Exemption)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl h-11 px-4 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                        placeholder="e.g. 30000"
                        value={lta}
                        onChange={(e) => setLta(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* TOGGLES */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  onClick={() => setIsMetro(!isMetro)}
                  className={`rounded-2xl p-4 border transition-all ${
                    isMetro
                      ? "btnRegular shadow-lg shadow-blue-400/20"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 font-semibold text-sm">
                    <Check size={18} />
                    {isMetro ? "Metro City (50% HRA)" : "Non-Metro (40% HRA)"}
                  </div>
                </button>
                <button
                  onClick={() => setRegime(regime === "old" ? "new" : "old")}
                  className={`rounded-2xl p-4 border transition-all uppercase tracking-wide ${
                    regime === "new"
                      ? "btnRegular shadow-emerald-400/20"
                      : "btnRegular shadow-lg shadow-amber-400/20"
                  }`}
                >
                  <div className="font-bold flex justify-center items-center gap-2 text-sm">
                    <ShieldCheck size={16} /> {regime} Regime
                  </div>
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: BREAKDOWN / EMPTY STATE */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-8 text-slate-800">
                <TrendingUp className="text-emerald-400" />
                <h2 className="text-2xl font-bold">Salary Breakdown</h2>
              </div>

              {result ? (
                <>
                  {/* TAKE HOME BADGE */}
                  <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-emerald-500 p-8 text-white mb-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
                      <IndianRupee size={160} />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                      Estimated Annual Take Home
                    </div>
                    <div className="text-4xl font-black mt-2 tracking-tight">
                      ₹{formatCurrency(result.annual.takeHome)}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm font-medium">
                      <span>Monthly Distribution:</span>
                      <span className="text-lg font-bold bg-white/20 px-3 py-0.5 rounded-xl">
                        ₹{formatCurrency(result.annual.takeHome / 12)}
                      </span>
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                      <div className="text-slate-400 text-xs font-medium">Gross Salary</div>
                      <div className="text-lg font-bold mt-1 text-slate-800">
                        ₹{formatCurrency(result.annual.gross)}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                      <div className="text-slate-400 text-xs font-medium">Calculated Tax</div>
                      <div className="text-lg font-bold mt-1 text-rose-400">
                        ₹{formatCurrency(result.annual.tax)}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                      <div className="text-slate-400 text-xs font-medium">HRA Exemption</div>
                      <div className="text-lg font-bold mt-1 text-emerald-400">
                        ₹{formatCurrency(result.annual.hraExemption)}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                      <div className="text-slate-400 text-xs font-medium">Applied Deductions</div>
                      <div className="text-lg font-bold mt-1 text-blue-400">
                        ₹{formatCurrency(result.annual.deductions)}
                      </div>
                    </div>
                  </div>

                  {/* INSIGHTS */}
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <BadgeIndianRupee className="text-blue-400" size={20} />
                      <h3 className="text-lg font-bold text-blue-400">Smart System Insights</h3>
                    </div>
                    <div className="space-y-3">
                      {generateInsights(result).map((i, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl p-4"
                        >
                          <div className="w-6 h-6 rounded-full bg-emerald-400/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={14} className="text-emerald-400" />
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{i}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="grid grid-cols-2 gap-2 mt-8">
                    <button
                      onClick={() => downloadPDF(result)}
                      className="h-12 rounded-2xl btnRegular transition font-semibold flex items-center justify-center gap-2 text-xs shadow-lg shadow-rose-600/10"
                    >
                      <Download size={16} /> Download PDF
                    </button>
                    <button
                      onClick={() => exportToExcel(result)}
                      className="h-12 rounded-2xl btnRegularblue transition font-semibold flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/10"
                    >
                      <Download size={16} /> Export Excel
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-blue-400/10 flex items-center justify-center mb-5 border border-blue-500/10">
                    <IndianRupee size={36} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Awaiting Parameters</h3>
                  <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                    Provide your basic monthly earnings configuration on the left panel to trigger
                    live in-hand calculations.
                  </p>
                </div>
              )}
            </div>
          </div>
      </ToolHeroShell>

            <ToolPageContent
        category="business-tools"
        currentToolPath="/business-tools/salary-calculator"
        howTitle="In-hand salary, tax-aware clarity."
        howBody="FreeToolsPro Salary Calculator estimates take-home pay with HRA, deductions, and new vs old regime comparison—so offers, appraisals, and monthly budgeting stay grounded in numbers."
        steps={[
          { title: "Add compensation inputs", body: "Monthly base, rent, bonus, and other income as needed." },
          { title: "Choose metro & regime", body: "Metro status and tax regime shape HRA and tax liability." },
          { title: "Read in-hand pay", body: "See net salary, tax, and deductions in a clean breakdown." },
        ]}
        faqs={[
          { q: "Does it replace a tax professional?", a: "No. It is an estimate for planning—confirm filings with an advisor when needed." },
          { q: "Are my salary details uploaded?", a: "No. Calculations stay in your browser." },
          { q: "Can I compare tax regimes?", a: "Yes. Switch regimes to preview how take-home pay changes." },
        ]}
        trustBullets={[
          "Private, browser-local salary math",
          "HRA and deduction aware",
          "Regime comparison without spreadsheets",
        ]}
        ctaLabel="Calculate salary"
        exploreLabel="More business tools from FreeToolsPro."
      />
    </>
  );
}

/* ---------------- EXTRA UI HELPERS ---------------- */
function GlassBox({ children }) {
  return (
    <div className="relative mb-4">
      <div className="p-2">{children}</div>
    </div>
  );
}

function GlassCard({ title, children }) {
  return (
    <GlassBox>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </GlassBox>
  );
}

function Row({ label, value, bold, highlight, tip, index }) {
  return (
    <tr className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
      <td
        className={`px-4 py-3 flex items-center gap-2 ${bold ? "font-semibold" : ""} ${highlight ? "text-green-600 font-bold" : ""}`}
      >
        {label}
        {tip && (
          <span className="group relative">
            <Info size={14} className="text-gray-400 cursor-pointer" />
            <span className="absolute z-10 hidden group-hover:block w-64 p-3 text-xs text-white bg-black/80 rounded-xl -top-2 left-6">
              {tip}
            </span>
          </span>
        )}
      </td>
      <td className={`px-4 py-3 text-right ${highlight ? "text-green-600 text-lg font-bold" : ""}`}>
        ₹{value.toLocaleString()}
      </td>
    </tr>
  );
}

function Toggle({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition ${active ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-300"}`}
    >
      {label}
    </button>
  );
}
