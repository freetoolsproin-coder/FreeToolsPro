import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";

// 🔢 Smooth Animated Counter Hook
function useCounter(value, duration = 400) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let start = display;
    const diff = value - start;
    if (diff === 0) return;

    const steps = duration / 16;
    const increment = diff / steps;
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment >= 0 && current >= value) || (increment < 0 && current <= value)) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(current);
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

  // Math Calculations
  const gst = mode === "exclusive" ? (amt * rate) / 100 : (amt * rate) / (100 + rate);
  const total = mode === "exclusive" ? amt + gst : amt;
  const base = mode === "exclusive" ? amt : amt - gst;

  const cgst = type === "cgst" ? gst / 2 : 0;
  const sgst = type === "cgst" ? gst / 2 : 0;
  const igst = type === "igst" ? gst : 0;

  // Animated values
  const aBase = useCounter(base);
  const aGST = useCounter(gst);
  const aCgst = useCounter(cgst);
  const aSgst = useCounter(sgst);
  const aIgst = useCounter(igst);
  const aTotal = useCounter(total);

  // Quick Slab Comparer Calculation helper
  const getSlabTotal = (slabRate) => {
    const calculatedGst =
      mode === "exclusive" ? (amt * slabRate) / 100 : (amt * slabRate) / (100 + slabRate);
    return mode === "exclusive" ? amt + calculatedGst : amt;
  };

  return (
    <>
      <Seo page="gstCalculator" />

      <ToolHeroShell
        category="business-tools"
        icon={Briefcase}
        title="GST Calculator"
        subtitle="Multi-Slab • Live Breakdown"
        formLabel="Calculate"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          {/* LEFT: inputs */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            {/* Amount Input */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount (e.g., 10000)"
                min="0"
                step="0.01"
                inputMode="decimal"
                className="w-full rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
              />

              {/* Rate Selection */}
              <div className="mb-5 mt-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">GST Rate</label>
                <select
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full rounded-xl bg-gray-50 text-gray-800 border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {[5, 12, 18, 28].map((r) => (
                    <option key={r} value={r}>
                      {r}% GST Slab
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode (Exclusive / Inclusive) */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Tax Mode</label>
                <div className="flex gap-3">
                  {["exclusive", "inclusive"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 py-3 rounded-xl font-semibold border transition-all ${
                        mode === m
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {m === "exclusive" ? "GST Extra (+)" : "GST Inclusive (-)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tax Type (CGST+SGST vs IGST) */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Transaction Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setType("cgst")}
                    className={`flex-1 py-2.5 rounded-xl font-medium border transition-all ${
                      type === "cgst"
                        ? "bg-gray-800 border-gray-800 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Intra-State (CGST + SGST)
                  </button>
                  <button
                    onClick={() => setType("igst")}
                    className={`flex-1 py-2.5 rounded-xl font-medium border transition-all ${
                      type === "igst"
                        ? "bg-gray-800 border-gray-800 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Inter-State (IGST)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: results */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24 space-y-4">
            {/* Dynamic Live Calculations Display — light panel */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3.5 text-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Net Base Amount</span>
                <span className="font-mono text-base text-slate-800">₹ {aBase.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm text-indigo-600 border-b border-slate-100 pb-2">
                <span>Total GST ({rate}%)</span>
                <span className="font-mono text-base font-semibold">₹ {aGST.toFixed(2)}</span>
              </div>

              {type === "cgst" && (
                <div className="bg-slate-50 p-2.5 rounded-lg space-y-2 text-xs text-emerald-700 font-mono border border-slate-100">
                  <div className="flex justify-between">
                    <span>Central GST (CGST - {rate / 2}%)</span>
                    <span>₹ {aCgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State GST (SGST - {rate / 2}%)</span>
                    <span>₹ {aSgst.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {type === "igst" && (
                <div className="bg-slate-50 p-2.5 rounded-lg flex justify-between text-xs text-amber-700 font-mono border border-slate-100">
                  <span>Integrated GST (IGST - {rate}%)</span>
                  <span>₹ {aIgst.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center font-bold text-xl text-emerald-700 border-t border-slate-100 pt-3">
                <span className="text-lg text-slate-800">Gross Total Amount</span>
                <span className="font-mono">₹ {aTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Quick Comparison Box across all GST Slabs */}
            {amt > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 transition-all animate-fadeIn">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  Cross-Slab Reference Comparison
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[5, 12, 18, 28].map((slab) => (
                    <div
                      key={slab}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        rate === slab
                          ? "bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-500/10"
                          : "bg-slate-50/50 border-slate-100"
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-500">{slab}% Slab</div>
                      <div className="text-sm font-mono font-bold mt-1 text-slate-800">
                        ₹ {getSlabTotal(slab).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

            <ToolPageContent
        category="business-tools"
        currentToolPath="/business-tools/gst-calculator"
        howTitle="GST-inclusive or exclusive—sorted."
        howBody="FreeToolsPro GST Calculator adds or removes GST by slab, then splits CGST/SGST or IGST so invoices, quotes, and pricing stay accurate without spreadsheet fuss."
        steps={[
          { title: "Enter taxable amount", body: "Type the base price or GST-inclusive total." },
          { title: "Pick rate & mode", body: "Choose the GST slab and inclusive vs exclusive calculation." },
          { title: "Use the breakdown", body: "Copy base, GST, and payable totals for billing." },
        ]}
        faqs={[
          { q: "Is the GST Calculator free?", a: "Yes. Unlimited calculations with no signup." },
          { q: "Can it remove GST from a total?", a: "Yes. Switch to inclusive mode to back-calculate taxable value." },
          { q: "Does it store invoice data?", a: "No. All math runs locally in your browser." },
          { q: "Which slabs are supported?", a: "Common Indian GST slabs including 5%, 12%, 18%, and 28%." },
        ]}
        trustBullets={[
          "Inclusive and exclusive GST modes",
          "CGST/SGST and IGST splits",
          "Private local calculations",
        ]}
        ctaLabel="Calculate GST"
        exploreLabel="More business tools from FreeToolsPro."
      />
    </>
  );
}
