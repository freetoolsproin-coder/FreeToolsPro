import { useEffect, useState } from "react";
import Seo from "../components/Seo";

// 🔢 Animated Counter Hook
function useCounter(value, duration = 600) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return display;
}

export default function GstCalculator() {
    const [amount, setAmount] = useState("");
    const [rate, setRate] = useState(18);
    const [mode, setMode] = useState("exclusive");
    const [type, setType] = useState("cgst"); // cgst | igst

    const amt = parseFloat(amount) || 0;
    const gst =
      mode === "exclusive"
        ? (amt * rate) / 100
        : (amt * rate) / (100 + rate);

    const total = mode === "exclusive" ? amt + gst : amt;
    const base = mode === "exclusive" ? amt : amt - gst;

    const cgst = type === "cgst" ? gst / 2 : 0;
    const sgst = type === "cgst" ? gst / 2 : 0;
    const igst = type === "igst" ? gst : 0;

    // Animated values
    const aBase = useCounter(base);
    const aGST = useCounter(gst);
    const aTotal = useCounter(total);

    function useCounter(value, duration = 600) {
    const [display, setDisplay] = useState(value);

    useEffect(() => {
      let start = display;
      const diff = value - start;
      const steps = duration / 16;
      const increment = diff / steps;
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (
          (increment >= 0 && current >= value) ||
          (increment < 0 && current <= value)
        ) {
          setDisplay(value);
          clearInterval(timer);
        } else {
          setDisplay(current);
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return display;
  }


  return (
    <>

    <Seo page="gstCalculator" />
    <main className="min-h-screen items-center justify-center bg-green px-4 p-10">

      <section className="relative max-w-2xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_70px_rgba(168,85,247,0.45)] p-8">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur opacity-30"></div>

        <div className="relative">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">💸 GST Calculator</h1>
          <p className="text-center text-black/70 mb-6">Animated • CGST/SGST/IGST • Slab Compare</p>

          {/* Amount */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount (₹)"
            min="0"
            step="0.01"
            inputMode="decimal"
            className="w-full mb-4 rounded-xl bg-white/20 text-gray-800 placeholder-black/60 border border-black/30 px-4 py-3 focus:ring-4 focus:ring-indigo-500/50"
          />

          {/* Rate */}
          <select
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full mb-4 rounded-xl bg-white/20 text-gray-800 border border-black/30 px-4 py-3"
          >
            {[5, 12, 18, 28].map((r) => (
              <option key={r} value={r}>{r}% GST</option>
            ))}
          </select>

          {/* Mode */}
          <div className="flex gap-3 mb-4">
            {["exclusive", "inclusive"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 rounded-xl font-semibold ${mode === m ? "bg-indigo-600" : "bg-white/20"}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tax Type */}
          <div className="flex gap-3 mb-6">
            <button onClick={() => setType("cgst")} className={`flex-1 py-2 rounded-lg ${type === "cgst" ? "bg-green-600" : "bg-black/20"}`}>
              CGST + SGST
            </button>
            <button onClick={() => setType("igst")} className={`flex-1 py-2 rounded-lg ${type === "igst" ? "bg-pink-600" : "bg-black/20"}`}>
              IGST
            </button>
          </div>

          {/* Results with animation */}
          <div className="bg-black/40 rounded-2xl p-5 border border-white/20 space-y-2 text-white">
            <div className="flex justify-between"><span>Base</span><span>₹ {aBase.toFixed(2)}</span></div>
            <div className="flex justify-between text-indigo-300"><span>GST</span><span>₹ {aGST.toFixed(2)}</span></div>
            {type === "cgst" && (
              <>
                <div className="flex justify-between text-green-300"><span>CGST</span><span>₹ {cgst.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-300"><span>SGST</span><span>₹ {sgst.toFixed(2)}</span></div>
              </>
            )}
            {type === "igst" && (
              <div className="flex justify-between text-pink-300"><span>IGST</span><span>₹ {igst.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between font-bold text-lg text-green-400 border-t border-black/20 pt-2">
              <span>Total</span><span>₹ {aTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* GST Slab Comparison */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[5, 12, 18, 28].map((r) => (
              <div key={r} className={`rounded-xl p-3 border ${rate === r ? "border-indigo-400 bg-indigo-500/20" : "border-black/20 bg-black/10"}`}>
                <p className="text-sm text-black/70">{r}% GST</p>
                <p className="text-lg font-bold text-black">₹ {((amt * r) / 100).toFixed(0)}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-800/60 mt-6">✨ Animated • India GST Ready • Free Tool</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-12 text-gray-800/80 text-sm leading-relaxed pt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 pb-2">
          What is GST Calculator?
        </h2>
        <p className="text-1xl">
          This GST Calculator helps you calculate Goods and Services Tax (GST) in India
          for both inclusive and exclusive prices. It supports CGST, SGST, and IGST
          with real-time animated results.
        </p>

        <h3 className=" text-1xl font-bold mt-4 pb-4 pt-5">GST Rates in India</h3>
        <ul className="list-disc ml-5 pl-5 leading-8">
          <li className="text-1xl">5% GST – Essential goods</li>
          <li className="text-1xl">12% GST – Standard goods</li>
          <li className="text-1xl">18% GST – Most services</li>
          <li className="text-1xl">28% GST – Luxury items</li>
        </ul>
      </section>

    </main>


    </>
  );
}
