import { useState } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import { Check, RefreshCw, Calculator } from "lucide-react";

export default function GstCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState("exclusive"); // exclusive | inclusive

  const amt = parseFloat(amount) || 0;
  const gst =
    mode === "exclusive"
      ? (amt * rate) / 100
      : amt - amt * (100 / (100 + rate));

  const net = mode === "exclusive" ? amt + gst : amt - gst;

  return (
    <>
      <Seo page="gstCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Free Online GST Calculator"
        subtitle="Calculate Goods and Services Tax (GST) for any amount"
        formLabel="Calculate"
      >

            {/* Amount */}
            <label className="block text-sm text-white/80 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full mb-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            />
            {/* GST Rate */}
            <label className="block text-sm text-white/80 mb-1">
              GST Rate
            </label>
            <select
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full mb-4 rounded-xl bg-white/20 text-white border border-white/30 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            >
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>

            {/* Mode */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setMode("exclusive")}
                className={`flex-1 rounded-xl py-3 font-semibold transition ${
                  mode === "exclusive"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white/20 text-white/80"
                }`}
              >
                Exclusive GST
              </button>
              <button
                onClick={() => setMode("inclusive")}
                className={`flex-1 rounded-xl py-3 font-semibold transition ${
                  mode === "inclusive"
                    ? "bg-pink-600 text-white shadow-lg"
                    : "bg-white/20 text-white/80"
                }`}
              >
                Inclusive GST
              </button>
            </div>

            {/* Results */}
            <div className="rounded-2xl bg-black/30 border border-white/20 p-5 space-y-2 text-white">
              <div className="flex justify-between">
                <span>Base Amount</span>
                <span>
                  ₹ {mode === "exclusive" ? amt.toFixed(2) : net.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-indigo-300">
                <span>GST ({rate}%)</span>
                <span>₹ {gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-green-400 border-t border-white/20 pt-2">
                <span>Total</span>
                <span>
                  ₹ {mode === "exclusive" ? net.toFixed(2) : amt.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Badge */}
            <div className="mt-6 text-center text-xs text-white/60">
              ✨ 100% Free • No Signup • Instant Calculation
            </div>
          
      </ToolHeroShell>
      <ToolContentLayout
        category="calculators"
        currentToolPath="/business-tools/gst-calculator" />
    </>
  );
}
