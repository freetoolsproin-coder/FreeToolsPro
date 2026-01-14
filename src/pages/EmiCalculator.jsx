import { useState, useEffect } from "react";
import Seo from "../components/Seo";

export default function EmiCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [emi, setEmi] = useState(null);

  useEffect(() => {
    if (!amount || !rate || !years) {
      setEmi(null);
      return;
    }

    const P = parseFloat(amount);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(years) * 12;

    if (P <= 0 || r <= 0 || n <= 0) return;

    const emiValue =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    setEmi(Math.round(emiValue));
  }, [amount, rate, years]);

  return (
    <>

      <Seo page="emiCalculator" />
      <main className="min-h-screen items-center justify-center px-4 bg-green p-10">
        
        {/* Glass Card */}
        <section className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
            💰 EMI Calculator
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Calculate your monthly loan EMI instantly
          </p>

          {/* Loan Amount */}
          <div className="input-card">
            <label className="input-title">Loan Amount</label>
            <div className="input-shell">
              <input
                type="number"
                className="input-core w-full border border-gray-300 rounded-xl p-4 mb-3
                      focus:outline-none focus:ring-4 focus:ring-green-200"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="input-card">
            <label className="input-title">Interest Rate</label>
            <div className="input-shell">
              <input
                type="number"
                step="0.01"
                className="input-core w-full border border-gray-300 rounded-xl p-4 mb-3
                      focus:outline-none focus:ring-4 focus:ring-green-200"
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="input-card">
            <label className="input-title">Loan Tenure</label>
            <div className="input-shell">
              <input
                type="number"
                className="input-core w-full border border-gray-300 rounded-xl p-4 mb-3
                      focus:outline-none focus:ring-4 focus:ring-green-200"
                onChange={(e) => setYears(e.target.value)}
              />
            </div>
          </div>

          {/* Result */}
          {emi && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Your Monthly EMI</p>
              <p className="text-4xl font-extrabold text-emerald-600">
                ₹{emi.toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </section>

        <section className="max-w-4xl mx-auto mt-12 text-gray-700 leading-relaxed">
          <h2 className="text-2xl font-bold mb-4">
            EMI Calculator – Plan Your Loan Smartly
          </h2>

          <p className="mb-4">
            An EMI (Equated Monthly Installment) Calculator helps you estimate the
            monthly payment required to repay a loan. By entering the loan amount,
            interest rate, and tenure, you can instantly calculate your EMI and plan
            your finances better.
          </p>

          <h2 className="text-1xl font-bold mb-4">
            How Does the EMI Calculator Work?
          </h2>

          <p className="mb-4">
            This EMI calculator uses a standard loan amortization formula to calculate
            your monthly EMI. It considers the principal loan amount, annual interest
            rate, and loan tenure to give accurate results in real time.
          </p>

          <h2 className="text-1xl font-bold mb-4">
            Why Use Our EMI Calculator?
          </h2>

          <ul className="list-disc pl-6 mb-4">
            <li>Instant and accurate EMI calculation</li>
            <li>Suitable for home loans, personal loans & car loans</li>
            <li>No signup or personal data required</li>
            <li>Mobile-friendly and fast loading</li>
          </ul>

          <h2 className="text-1xl font-bold mb-4">
            Who Should Use This EMI Calculator?
          </h2>

          <p>
            This tool is ideal for anyone planning to take a loan and wants to
            understand their monthly repayment amount before making a financial
            decision.
          </p>
      </section>

    </main>
    
    </>
  );
}
