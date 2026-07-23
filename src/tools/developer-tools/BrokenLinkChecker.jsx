import React, { useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

export default function BrokenLinkChecker() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckLinks = async () => {
    if (!url) {
      setError("Please enter a website URL to check.");
      return;
    }
    setError("");
    setIsLoading(true);
    setResults([]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const base = url.replace(/\/$/, "");
    const dummyResults = [
      { url: `${base}/`, status: 200, statusText: "OK" },
      { url: `${base}/about`, status: 200, statusText: "OK" },
      { url: `${base}/contact`, status: 404, statusText: "Not Found" },
      { url: `${base}/blog`, status: 200, statusText: "OK" },
      { url: `${base}/products/item-1`, status: 200, statusText: "OK" },
      { url: `${base}/products/item-2-old`, status: 404, statusText: "Not Found" },
      { url: `${base}/external-link`, status: 500, statusText: "Internal Server Error" },
    ];

    setResults(dummyResults);
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "text-emerald-400";
    if (status >= 400 && status < 500) return "text-red-400";
    if (status >= 500) return "text-amber-400";
    return "text-slate-400";
  };

  return (
    <>
      <Seo page="brokenLinkChecker" />

      <ToolHeroShell
        icon={Link2}
        title="Broken Link Checker Demo"
        subtitle="Demo table with sample paths and statuses—not a live website crawl."
        maxWidth="max-w-5xl"
      >
        <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          This tool does <strong>not</strong> crawl your site. Results are fabricated sample rows for UI
          practice only.
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className={`${inputDark} flex-grow`}
          />
          <button
            type="button"
            onClick={handleCheckLinks}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            {isLoading ? "Generating…" : "Show demo results"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="mt-4 text-center text-sm text-slate-400">
            Generating sample link statuses…
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/80">
            <p className="border-b border-slate-700 px-4 py-3 text-sm text-amber-200/90">
              Sample demo rows only — statuses are not live HTTP checks.
            </p>
            <table className="min-w-full text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">URL</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Status Text</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {results.map((result, index) => (
                  <tr key={index} className="border-t border-slate-700">
                    <td className="break-all px-4 py-3">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:underline"
                      >
                        {result.url}
                      </a>
                    </td>
                    <td className={`px-4 py-3 font-semibold ${getStatusColor(result.status)}`}>
                      {result.status}
                    </td>
                    <td className={`px-4 py-3 ${getStatusColor(result.status)}`}>
                      {result.statusText}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="developer-tools"
        currentToolPath="/developer-tools/broken-link-checker" />
    </>
  );
}
