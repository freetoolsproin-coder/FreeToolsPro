import { useState, useEffect } from "react";
import Seo from "../components/Seo";
import { Info } from "lucide-react";

/* ---------------- CONSTANTS ---------------- */

const OLD_EXEMPTION = 250000;
const NEW_EXEMPTION = 300000;
const R = (n) => Math.round(n);

/* ---------------- COMPONENT ---------------- */

export default function SalaryCalculator() {
  const [monthlySalary, setMonthlySalary] = useState("");
  const [regime, setRegime] = useState("new");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!monthlySalary || monthlySalary <= 0) {
      setResult(null);
      return;
    }

    /* Monthly → Annual */
    const annualSalary = Number(monthlySalary) * 12;

    /* -------- MONTHLY EMPLOYER CTC BREAKUP -------- */
    const basicMonthly = R(monthlySalary * 0.4);
    const employerPFMonthly = R(basicMonthly * 0.12);
    const grossMonthly = R(monthlySalary - employerPFMonthly);

    /* -------- EMPLOYEE DEDUCTION (ANNUAL) -------- */
    const basicAnnual = basicMonthly * 12;
    const employeePFAnnual = R(basicAnnual * 0.12);

    /* -------- TAX (ANNUAL) -------- */
    const grossAnnual = grossMonthly * 12;

    let oldTaxable = R(grossAnnual - employeePFAnnual - OLD_EXEMPTION);
    let newTaxable = R(grossAnnual - employeePFAnnual - NEW_EXEMPTION);

    oldTaxable = Math.max(0, oldTaxable);
    newTaxable = Math.max(0, newTaxable);

    const oldTax = R(oldTaxable * 0.1);
    const newTax = R(newTaxable * 0.08);

    const takeHomeOldAnnual = R(grossAnnual - employeePFAnnual - oldTax);
    const takeHomeNewAnnual = R(grossAnnual - employeePFAnnual - newTax);

    const activeTakeHomeAnnual =
      regime === "old" ? takeHomeOldAnnual : takeHomeNewAnnual;

    setResult({
      monthly: {
        basic: basicMonthly,
        employerPF: employerPFMonthly,
        gross: grossMonthly,
      },
      annual: {
        employeePF: employeePFAnnual,
        tax: regime === "old" ? oldTax : newTax,
        takeHome: activeTakeHomeAnnual,
      },
    });
  }, [monthlySalary, regime]);

  return (
    <>
      
      <Seo page="salaryCalculator" />
      <main className="relative overflow-hidden bg-green">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

        <section className="max-w-3xl mx-auto px-4 py-10">

          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Salary Calculator
            </h1>
            <p className="mt-4 text-gray-600">
              Know your take-home salary with PF & tax clarity
            </p>
          </header>

          {/* INPUT */}
          <GlassBox>
            <label className="text-sm font-medium mb-2 block">
              Monthly Salary (₹)
            </label>

            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="e.g. 50,000"
              className="w-full rounded-2xl px-5 py-4 text-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
            />

            <Toggle
              active={regime === "new"}
              onClick={() =>
                setRegime(regime === "old" ? "new" : "old")
              }
              label={
                regime === "old"
                  ? "Old Tax Regime"
                  : "New Tax Regime"
              }
            />
          </GlassBox>

          {/* RESULTS */}
          {result && (
            <div className="grid md:grid-cols-2 gap-10 my-16">

              {/* MONTHLY EMPLOYER BREAKUP */}
              <GlassCard title="Employer CTC Breakup (Monthly)">
                <Row label="Basic Salary" value={result.monthly.basic} />
                <Row
                  label="Employer PF"
                  value={result.monthly.employerPF}
                  tip="Employer contributes 12% of basic salary to EPF."
                />
                <Row
                  label="Gross Salary"
                  value={result.monthly.gross}
                  bold
                />
              </GlassCard>

              {/* ANNUAL TAKE-HOME */}
              <GlassCard title="Deductions & Take-Home (Annual)">
                <Row
                  label="Employee PF"
                  value={result.annual.employeePF}
                  tip="12% of basic salary deducted annually towards EPF."
                />
                <Row
                  label="Income Tax"
                  value={result.annual.tax}
                  tip="Estimated income tax based on selected tax regime."
                />
                <Row
                  label="Take-Home Salary"
                  value={result.annual.takeHome}
                  highlight
                />
              </GlassCard>

            </div>
          )}
        </section>
      </main>
    </>
  );
}

/* ---------------- UI HELPERS ---------------- */

function GlassBox({ children }) {
  return (
    <div className="relative mb-12">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-2xl rounded-3xl" />
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
        {children}
      </div>
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

function Row({ label, value, bold, highlight, tip }) {
  return (
    <div
      className={`flex justify-between items-center ${
        bold ? "font-semibold" : ""
      } ${highlight ? "text-green-600 text-lg font-bold" : ""}`}
    >
      <span className="flex items-center gap-2">
        {label}
        {tip && (
          <span className="group relative">
            <Info size={14} className="text-gray-400 cursor-pointer" />
            <span className="absolute z-10 hidden group-hover:block w-64 p-3 text-xs text-white bg-black/80 rounded-xl -top-2 left-6">
              {tip}
            </span>
          </span>
        )}
      </span>
      <span>₹{value.toLocaleString()}</span>
    </div>
  );
}

function Toggle({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition ${
        active
          ? "bg-indigo-600 text-white shadow"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}
