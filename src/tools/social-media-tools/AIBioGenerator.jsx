import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import BioForm from "../../tools/social-media-tools/ai-bio/BioForm";
import BioOutput from "../../tools/social-media-tools/ai-bio/BioOutput";
import { generateBio } from "../../tools/social-media-tools/ai-bio/api";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

function App() {
  const [bios, setBios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Load saved bios history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("ai_bio_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse bio history", e);
      }
    }
  }, []);

  const handleGenerate = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const res = await generateBio(data);

      // Fallback check: Accept res.bios or res if it's already an array
      const generatedBios = res?.bios || (Array.isArray(res) ? res : null);

      if (generatedBios && generatedBios.length > 0) {
        setBios(generatedBios);

        // Save to history using functional updates to prevent stale state issues
        const newHistoryItem = {
          id: Date.now(),
          prompt: data.keywords || data.prompt || "Custom Bio",
          platform: data.platform || "Instagram",
          bios: generatedBios,
          timestamp: new Date().toLocaleDateString(),
        };

        setHistory((prevHistory) => {
          const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 5); // Keep last 5 generations
          localStorage.setItem("ai_bio_history", JSON.stringify(updatedHistory));
          return updatedHistory;
        });
      } else {
        // If the API succeeded but returned a bad structure or error flag
        throw new Error(
          res?.message ||
            res?.error ||
            "The server responded successfully but did not return any bios."
        );
      }
    } catch (err) {
      console.error("Frontend Error Detail:", err);
      // Capture and display the exact breakdown message or fallback to a structured reminder
      setError(
        err.message ||
          "Failed to connect to the backend. Please check your internet connection or server configurations."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("ai_bio_history");
  };

  return (
    <>
      {/* Dynamic SEO optimization */}
      <Seo page="aiBioGenerator" />

      <ToolHeroShell
        icon={Sparkles}
        title="AI Bio Generator"
        subtitle="Craft compelling, high-converting social media bios for Instagram, LinkedIn, X, and TikTok in seconds."
        category="social-media-tools"
        layout="stack"
        wide
      >
        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-r-xl border-l-4 border-red-500 bg-red-500/10 p-4 text-red-300 shadow-sm">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-sm font-bold text-red-300 hover:text-red-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Interactive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Settings */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-100 transition-all duration-200">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
              ⚙️ Customize Profile Settings
            </h3>
            <BioForm onGenerate={handleGenerate} isLoading={loading} />
          </div>

          {/* Right Column: Live Output & Previews */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Output Component */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                  🎯 Generated Bios
                </h3>
                <BioOutput bios={bios} loading={loading} />
              </div>
            </div>

            {/* Advanced Feature: History Panel */}
            {history.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    🕒 Recent History
                  </h4>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setBios(item.bios)}
                      className="p-3 text-left rounded-xl bg-slate-50 border border-slate-150 hover:border-indigo-400 cursor-pointer transition-all duration-150 flex justify-between items-center group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700 capitalize truncate max-w-[200px]">
                          {item.prompt}
                        </p>
                        <span className="text-xs text-slate-400">
                          {item.platform} • {item.timestamp}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        Restore ↺
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/ai-bio-generator" />
    </>
  );
}

export default App;
