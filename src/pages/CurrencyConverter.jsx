import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line,
 XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Seo from "../components/Seo";

/* ---------------- FLAGS (NO API) ---------------- */
const FLAGS = {
  USD: "🇺🇸",
  INR: "🇮🇳",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
  CHF: "🇨🇭",
};

/* ---------------- FAQ SCHEMA ---------------- */
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How accurate are currency exchange rates?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Rates are fetched from real-time financial market sources and updated automatically.",
      },
    },
    {
      "@type": "Question",
      name: "How often do currency rates refresh?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Rates refresh automatically every 30 minutes to ensure accuracy.",
      },
    },
    {
      "@type": "Question",
      name: "Is this currency converter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes, this currency converter is 100% free and requires no registration.",
      },
    },
  ],
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(null);
  const [trend, setTrend] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favCurrencies")) || []
  );

  /* ---------------- FETCH RATES (AUTO REFRESH) ---------------- */
  const fetchRates = () => {
    fetch("https://api.frankfurter.app/latest")
      .then((res) => res.json())
      .then((data) => {
        setRates({ ...data.rates, EUR: 1 });
      });
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 1800000); // 30 min
    return () => clearInterval(interval);
  }, []);

  /* ---------------- CONVERT ---------------- */
  useEffect(() => {
    if (!rates[from] || !rates[to]) return;
    const converted = (amount / rates[from]) * rates[to];
    setResult(Math.round(converted * 100) / 100);
  }, [amount, from, to, rates]);

  /* ---------------- TREND (LAST 7 DAYS) ---------------- */
  useEffect(() => {
    fetch(
      `https://api.frankfurter.app/2024-01-01..?from=${from}&to=${to}`
    )
      .then((res) => res.json())
      .then((data) => {
        const chart = Object.keys(data.rates)
          .slice(-7)
          .map((d) => ({
            date: d.slice(5),
            value: data.rates[d][to],
          }));
        setTrend(chart);
      });
  }, [from, to]);

  /* ---------------- FAVORITES ---------------- */
  const toggleFavorite = (cur) => {
    const updated = favorites.includes(cur)
      ? favorites.filter((f) => f !== cur)
      : [...favorites, cur];

    setFavorites(updated);
    localStorage.setItem("favCurrencies", JSON.stringify(updated));
  };

  return (
    <>

      <Seo page="currencyConverter" />
      <main className="min-h-screen flex items-center justify-center bg-green px-4">

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify(FAQ_SCHEMA)}
        </script>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full glass-cardbg max-w-lg p-6 rounded-3xl
          bg-white/10 backdrop-blur-xl border border-white/20
          shadow-[0_0_60px_rgba(99,102,241,0.35)]"
        >
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            💱 Currency Converter
          </h1>

          {/* Amount */}
          <input
            type="number"
            value={amount}
            min="1"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-4 rounded-xl px-4 py-3 bg-black/40 text-white border border-white/20"
          />

          {/* Select */}
          <div className="flex gap-3 mb-4">
            {[from, to].map((val, idx) => (
              <select
                key={idx}
                value={val}
                onChange={(e) =>
                  idx === 0 ? setFrom(e.target.value) : setTo(e.target.value)
                }
                className="w-full rounded-xl px-3 py-3 bg-black/40 text-white border border-white/20"
              >
                {Object.keys(rates).map((cur) => (
                  <option key={cur} value={cur}>
                    {FLAGS[cur] || "🌍"} {cur}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* Favorites */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {Object.keys(rates).slice(0, 8).map((cur) => (
              <button
                key={cur}
                onClick={() => toggleFavorite(cur)}
                className={`px-3 py-1 rounded-full text-sm
                ${
                  favorites.includes(cur)
                    ? "bg-yellow-400 text-black"
                    : "bg-white/20 text-white"
                }`}
              >
                ⭐ {cur}
              </button>
            ))}
          </div>

          {/* Result */}
          {result && (
            <div className="text-center p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-6">
              <p className="text-gray-300">
                {amount} {from}
              </p>
              <p className="text-3xl font-bold text-emerald-400">
                {result} {to}
              </p>
            </div>
          )}

          {/* Trend Chart */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="date" stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={3}
                  stroke="#22c55e"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </main>
    
    </>
  );
}
