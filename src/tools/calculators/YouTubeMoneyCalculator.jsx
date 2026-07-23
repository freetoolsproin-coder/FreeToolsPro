import { Calculator } from "lucide-react";
import React, { useState, useMemo } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function YouTubeMoneyCalculator() {
  const [views, setViews] = useState(100000);
  const [cpm, setCpm] = useState(2);

  const earnings = useMemo(() => {
    return (views / 1000) * cpm;
  }, [views, cpm]);

  const daily = earnings / 30;
  const yearly = earnings * 12;

  return (
    <>
      <Seo page="youtubeMoneyCalculator" />

      <ToolHeroShell
        category="calculators"
        icon={Calculator}
        title="Free Online YouTube Money Calculator"
        subtitle="Estimate your YouTube earnings based on views and CPM"
        formLabel="Calculate"
      >

            <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              Free Online YouTube Money Calculator
            </h1>
            <p className="text-sm text-slate-300">
              Estimate your YouTube earnings based on views and CPM
            </p>
          </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Monthly Views
                </label>
                <input
                  type="number"
                  value={views}
                  onChange={(e) => setViews(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3.5 font-medium text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">CPM ($)</label>
                <input
                  type="number"
                  value={cpm}
                  step="0.1"
                  onChange={(e) => setCpm(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3.5 font-medium text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
                />
              </div>

              <div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={cpm}
                  onChange={(e) => setCpm(Number(e.target.value))}
                  className="w-full inputSlider h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-sky-400"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="bg-slate-800/50 p-5 rounded-2xl text-center">
                <p className="text-sm text-slate-300 mb-2">Estimated Monthly Earnings:</p>
                <h2 className="text-3xl font-bold text-emerald-400">${earnings.toFixed(2)}</h2>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-700/50 rounded-xl">
                    <p className="text-slate-400">Daily</p>
                    <p className="font-semibold text-white">${daily.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-xl">
                    <p className="text-slate-400">Yearly</p>
                    <p className="font-semibold text-white">${yearly.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          
      </ToolHeroShell>

      <ToolContentLayout
        category="calculators"
        currentToolPath="/social-media-tools/youtube-money-calculator" />
    </>
  );
}
