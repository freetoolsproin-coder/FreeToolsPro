import { useEffect, useState } from "react";
import Seo from "../components/Seo";

export default function SipCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!amount || !rate || !years) {
      setResult(null);
      setError("");
      return;
    }

    const P = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(years) * 12;

    if (isNaN(P) || isNaN(r) || isNaN(n)) {
      setResult(null);
      setError("⚠️ Enter valid numeric values");
      return;
    }

    setError("");

    const maturity =
      P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

    setResult(Math.round(maturity).toLocaleString("en-IN"));
  }, [amount, rate, years]);

  return (
    <>

    <Seo page="sipCalculator" />
    <main className="min-h-screen items-center justify-center px-4 bg-green p-10">
      
      <section className="relative max-w-2xl mx-auto flex p-8 rounded-3xl
        bg-white/70 backdrop-blur-xl
        shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]">

        {/* Glow */}
        <div className="absolute -inset-1 rounded-3xl
          bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
          blur opacity-25"></div>

        <div className="relative">
          <h1 className="text-3xl font-extrabold text-center mb-2">
            💰 SIP Calculator
          </h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Live investment growth preview
          </p>

          <input
            type="number"
            placeholder="Monthly Investment (₹)"
            className="w-full mb-3 p-4 rounded-xl border
              focus:ring-4 focus:ring-purple-300"
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="number"
            placeholder="Expected Return (%)"
            className="w-full mb-3 p-4 rounded-xl border
              focus:ring-4 focus:ring-pink-300"
            onChange={(e) => setRate(e.target.value)}
          />

          <input
            type="number"
            placeholder="Investment Period (Years)"
            className="w-full mb-4 p-4 rounded-xl border
              focus:ring-4 focus:ring-indigo-300"
            onChange={(e) => setYears(e.target.value)}
          />

          {/* Error */}
          {error && (
            <p className="text-center text-red-600 font-medium animate-pulse">
              {error}
            </p>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 p-4 rounded-xl bg-green-100/70 text-center
              transition-all duration-300">
              <p className="text-sm text-gray-600">Estimated Maturity Amount</p>
              <p className="text-2xl font-extrabold text-green-700">
                ₹{result}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-12 text-gray-700 leading-relaxed">
        <h2 className="text-2xl font-bold mb-4">
          What is a SIP Calculator?
        </h2>
        <p className="mb-4">
          A SIP (Systematic Investment Plan) Calculator helps you estimate the future
          value of your monthly mutual fund investments. By entering your investment
          amount, expected annual return rate, and investment duration, you can
          instantly see how your money grows over time.
        </p>

        <h2 className="text-1xl font-bold mb-4">
          How Does This SIP Calculator Work?
        </h2>
        <p className="mb-4">
          This SIP calculator uses a standard compound interest formula to calculate
          the estimated maturity amount. It assumes that you invest a fixed amount
          every month and earn compounded returns based on the expected annual rate.
          Results are updated live as you change the values.
        </p>

        <h2 className="text-1xl font-bold mb-4">
          Why Use Our SIP Calculator?
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Instant and accurate SIP return calculation</li>
          <li>No signup or personal data required</li>
          <li>Mobile-friendly and fast loading</li>
          <li>Ideal for mutual fund investors in India</li>
        </ul>

        <h2 className="text-1xl font-bold mb-4">
          Who Should Use This Tool?
        </h2>
        <p>
          This SIP calculator is useful for beginners, long-term investors, and anyone
          planning wealth creation through mutual funds. It helps you plan investments
          better and set realistic financial goals.
        </p>
      </section>

    </main>
    
  
    </>
  );
}
