import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Tv, Zap, HelpCircle, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

const NICHE_PRESETS = [
  { name: "Finance & Investing", cpm: 12.5 },
  { name: "Tech & Gadgets", cpm: 7.8 },
  { name: "Health & Fitness", cpm: 5.5 },
  { name: "Lifestyle & Vlogs", cpm: 3.2 },
  { name: "Gaming", cpm: 2.1 },
  { name: "Entertainment & Comedy", cpm: 1.8 },
  { name: "Custom (Enter Manually)", cpm: "" },
];

const YouTubeMoneyCalculator = () => {
  const [views, setViews] = useState("");
  const [contentType, setContentType] = useState("long-form"); // long-form or shorts
  const [selectedNiche, setSelectedNiche] = useState(NICHE_PRESETS[1].name); // Default to Tech
  const [cpm, setCpm] = useState(NICHE_PRESETS[1].cpm);
  const [monetizationRate, setMonetizationRate] = useState(60); // % of views that show ads
  const [revenueType, setRevenueType] = useState("net"); // gross or net (after YT cut)
  const [result, setResult] = useState(null);

  const USD_TO_INR = 94.36; // Updated 2026 conversion rate

  // Automatically adjust CPM if Niche selection changes
  const handleNicheChange = (e) => {
    const nicheName = e.target.value;
    setSelectedNiche(nicheName);
    const preset = NICHE_PRESETS.find((n) => n.name === nicheName);
    if (preset && preset.cpm !== "") {
      setCpm(preset.cpm);
    }
  };

  // Adjust defaults based on Content Type
  useEffect(() => {
    if (contentType === "shorts") {
      setCpm(0.04); // Shorts RPM usually ranges $0.01 - $0.06
      setSelectedNiche("Custom (Enter Manually)");
    } else {
      setCpm(7.8);
      setSelectedNiche("Tech & Gadgets");
    }
  }, [contentType]);

  const calculate = () => {
    if (!views || !cpm) return;

    const totalViews = parseFloat(views);
    const selectedCpm = parseFloat(cpm);

    // Total monetized views based on the slider/input percentage
    const monetizedViews = totalViews * (monetizationRate / 100);

    // Gross Revenue calculation per month
    let monthlyUSD = (monetizedViews / 1000) * selectedCpm;

    // Deduct YouTube's platform fee if Net revenue is selected
    if (revenueType === "net") {
      if (contentType === "shorts") {
        monthlyUSD = monthlyUSD * 0.45; // YouTube keeps 55% of Shorts fund pool
      } else {
        monthlyUSD = monthlyUSD * 0.55; // YouTube keeps 45% of Long-form AdSense
      }
    }

    const dailyUSD = monthlyUSD / 30;
    const yearlyUSD = monthlyUSD * 12;

    setResult({
      dailyUSD: dailyUSD.toFixed(2),
      monthlyUSD: monthlyUSD.toFixed(2),
      yearlyUSD: yearlyUSD.toFixed(2),
      dailyINR: Math.round(dailyUSD * USD_TO_INR).toLocaleString("en-IN"),
      monthlyINR: Math.round(monthlyUSD * USD_TO_INR).toLocaleString("en-IN"),
      yearlyINR: Math.round(yearlyUSD * USD_TO_INR).toLocaleString("en-IN"),
    });
  };

  return (
    <>
      <Seo page="youtubeMoneyCalculator" />

      <ToolHeroShell
        category="social-media-tools"
        icon={Calculator}
        title="YouTube Money Calculator"
        subtitle="Estimate your dynamic ad earnings using customized channel configurations, content types, and actual monetization splits."
        formLabel="Calculate"
        layout="stack"
        wide
      >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-slate-800">
            {/* Form Input Container */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
              {/* Content Type Selector */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">
                  Content Strategy
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setContentType("long-form")}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium border text-sm transition ${
                      contentType === "long-form"
                        ? "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-600 dark:text-red-400"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Tv size={16} /> Long-form Videos
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType("shorts")}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-medium border text-sm transition ${
                      contentType === "shorts"
                        ? "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-600 dark:text-red-400"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Zap size={16} /> YouTube Shorts
                  </button>
                </div>
              </div>

              {/* Monthly Views Input */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-black">
                  Expected Monthly Views
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              {/* Niche Presets & Manual Input Configuration */}
              {contentType === "long-form" && (
                <div>
                  <label className="block text-sm font-semibold mb-1 text-black">
                    Channel Industry/Niche
                  </label>
                  <select
                    value={selectedNiche}
                    onChange={handleNicheChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-red-500 outline-none mb-3"
                  >
                    {NICHE_PRESETS.map((niche) => (
                      <option key={niche.name} value={niche.name}>
                        {niche.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* CPM Rate config */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-semibold text-black">
                    {contentType === "shorts"
                      ? "Estimated RPM ($ per 1,000 views)"
                      : "Estimated CPM ($ per 1,000 playbacks)"}
                  </label>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cpm}
                    onChange={(e) => {
                      setCpm(e.target.value);
                      setSelectedNiche("Custom (Enter Manually)");
                    }}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              {/* Advanced Slider Metric - Monetization Rate */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold flex items-center gap-1 text-black">
                    Monetized View Rate
                    <span
                      title="Not every video view contains ads. Usually, only 40%-80% of playbacks are monetized."
                      className="cursor-help text-slate-400"
                    >
                      <HelpCircle size={14} />
                    </span>
                  </span>
                  <span className="font-bold text-red-500">{monetizationRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={monetizationRate}
                  onChange={(e) => setMonetizationRate(e.target.value)}
                  className="w-full accent-red-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Platform Revenue Cut Configuration */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">
                  Payout Calculation Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-black">
                    <input
                      type="radio"
                      name="revType"
                      checked={revenueType === "net"}
                      onChange={() => setRevenueType("net")}
                      className="accent-red-500"
                    />
                    Net Take-Home Revenue{" "}
                    <span className="text-xs text-slate-400 text-black">(After YouTube's Cut)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-black">
                    <input
                      type="radio"
                      name="revType"
                      checked={revenueType === "gross"}
                      onChange={() => setRevenueType("gross")}
                      className="accent-red-500"
                    />
                    Gross Ad Revenue{" "}
                    <span className="text-xs text-slate-400 text-black">(Total Budget Split)</span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={calculate}
                className="w-full btnRegular py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-md shadow-red-600/10"
              >
                <Calculator size={18} /> Calculate Earnings
              </button>
            </div>

            {/* Advanced Analytical Outputs Panel */}
            <div className="lg:col-span-5 h-full">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 h-full flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-400 mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                      📊 Projections Timeline
                    </h3>

                    <div className="space-y-4">
                      {/* Daily Payout */}
                      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                          Daily Estimates
                        </span>
                        <div className="text-2xl font-black text-red-400">${result.dailyUSD}</div>
                        <div className="text-sm text-slate-300">₹{result.dailyINR} INR</div>
                      </div>

                      {/* Monthly Payout */}
                      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 ring-2 ring-red-500/20">
                        <span className="text-xs font-semibold uppercase tracking-wider text-red-400 block">
                          Monthly Revenue
                        </span>
                        <div className="text-3xl font-black text-white">${result.monthlyUSD}</div>
                        <div className="text-base font-medium text-slate-200">
                          ₹{result.monthlyINR} INR
                        </div>
                      </div>

                      {/* Yearly Payout */}
                      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                          Yearly Forecast
                        </span>
                        <div className="text-2xl font-black text-green-400">
                          ${result.yearlyUSD}
                        </div>
                        <div className="text-sm text-slate-300">₹{result.yearlyINR} INR</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 text-center italic mt-4 pt-3 border-t border-slate-800">
                    Calculations factored with a dynamic exchange rate fixed at 1 USD = ₹
                    {USD_TO_INR}.
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <RefreshCw size={32} className="animate-pulse mb-2 text-slate-300" />
                  <p className="text-sm font-medium">
                    Fill out your parameters and press calculate to display the advanced predictive
                    dashboard insights.
                  </p>
                </div>
              )}
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/you-tube-money-calculator" />
    </>
  );
};

export default YouTubeMoneyCalculator;
