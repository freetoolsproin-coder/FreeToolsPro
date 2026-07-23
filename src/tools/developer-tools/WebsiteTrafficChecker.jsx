import React, { useState } from "react";
import { Search, Loader2, BarChart3, MousePointerClick, FileText, KeyRound } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

const WebsiteTrafficChecker = () => {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckTraffic = async () => {
    if (!url) {
      setError("Please enter a website URL to check.");
      return;
    }
    setError("");
    setIsLoading(true);
    setResults(null);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const dummyResults = {
        domain: new URL(url.startsWith("http") ? url : `https://${url}`).hostname,
        monthlyVisits: Math.floor(Math.random() * (5000000 - 50000) + 50000),
        bounceRate: (Math.random() * (80 - 30) + 30).toFixed(2),
        pagesPerVisit: (Math.random() * (10 - 1.5) + 1.5).toFixed(2),
        topKeywords: [
          "free tools",
          "seo analysis",
          "competitor traffic",
          "website analytics",
          "marketing tools",
        ],
      };
      setResults(dummyResults);
    } catch {
      setError("Please enter a valid website URL.");
    }

    setIsLoading(false);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(num);
  };

  return (
    <>
      <Seo page="websiteTrafficChecker" />

      <ToolHeroShell
        category="developer-tools"
        icon={BarChart3}
        title="Website Traffic Checker Demo"
        subtitle="Demo only: random visits, bounce rate, and sample keywords—not real traffic data."
        formLabel="Check"
      >
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Numbers below are <strong>random placeholders</strong> for UI practice. They are not Similarweb,
            GA4, or any live analytics estimate.
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-slate-800">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-grow p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleCheckTraffic}
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2 disabled:bg-blue-300"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isLoading ? "Generating demo…" : "Run demo metrics"}
              </button>
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {isLoading && (
              <div className="text-center p-4">
                <p>Generating demo metrics…</p>
              </div>
            )}
            {results && (
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-center mb-4">
                  Demo metrics for: <span className="text-blue-600">{results.domain}</span>
                </h3>
                <p className="mb-4 text-center text-sm text-amber-800">
                  Illustrative only — not suitable for competitor research or investment decisions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Monthly Visits</p>
                    <p className="text-2xl">{formatNumber(results.monthlyVisits)}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <MousePointerClick className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Bounce Rate</p>
                    <p className="text-2xl">{results.bounceRate}%</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Pages per Visit</p>
                    <p className="text-2xl">{results.pagesPerVisit}</p>
                  </div>
                </div>
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <KeyRound className="h-5 w-5 text-blue-500" /> Top Organic Keywords (Sample)
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {results.topKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/website-traffic-checker" />
    </>
  );
};

export default WebsiteTrafficChecker;
