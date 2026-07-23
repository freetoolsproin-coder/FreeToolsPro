import { useState } from "react";
import Seo from "../components/Seo";

export default function AiInvestmentInsight() {
  const [age, setAge] = useState("");
  const [amount, setAmount] = useState("");
  const [risk, setRisk] = useState("medium");
  const [advice, setAdvice] = useState("");

  const generateAdvice = () => {
    let msg = "";

    if (age < 30 && risk === "high")
      msg = "🚀 Invest heavily in Equity Mutual Funds & Index Funds.";
    else if (age < 40) msg = "📈 Balance equity (70%) and debt (30%) for steady growth.";
    else if (age < 55) msg = "🛡️ Shift gradually towards debt & hybrid funds.";
    else msg = "🔒 Focus on capital protection via FD, SCSS & bonds.";

    msg += ` Monthly SIP of ₹${amount} is a good start.`;

    setAdvice(msg);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 px-4">
      <Seo title="AI Investment Insight" description="AI-powered investment advice instantly" />

      <section className="glass-card">
        <h1 className="title">🤖 AI Investment Insight</h1>

        <input
          type="number"
          placeholder="Your Age"
          className="input"
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="number"
          placeholder="Monthly Investment (₹)"
          className="input"
          onChange={(e) => setAmount(e.target.value)}
        />

        <select className="input" onChange={(e) => setRisk(e.target.value)}>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>

        <button onClick={generateAdvice} className="btn">
          Generate AI Insight
        </button>

        {advice && (
          <div className="result">
            <p>{advice}</p>
          </div>
        )}
      </section>
    </main>
  );
}
