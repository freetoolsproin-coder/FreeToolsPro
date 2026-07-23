import { useState } from "react";
import {
  Search,
  Loader2,
  ExternalLink,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";

function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function buildSiteQuery(target) {
  try {
    const u = new URL(target);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname === "/" ? "" : u.pathname;
    const query = path ? `site:${host}${path}` : `site:${host}`;
    return {
      host,
      query,
      googleUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    };
  } catch {
    return null;
  }
}

export default function GoogleIndexChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    const target = normalizeUrl(url);
    if (!target) {
      setError("Please enter a URL or domain.");
      return;
    }

    const site = buildSiteQuery(target);
    if (!site) {
      setError("Please enter a valid URL or domain.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    let reachable = false;
    try {
      await fetch(target, { method: "HEAD", mode: "no-cors" });
      reachable = true;
    } catch {
      reachable = false;
    }

    setResult({
      ...site,
      target,
      reachable,
    });
    setLoading(false);
  };

  return (
    <>
      <Seo page="googleIndexChecker" />
      <ToolHeroShell
        icon={Search}
        title="Google Index Checker"
        subtitle="Build a site: search query for Google, probe URL reachability, and get practical indexing tips."
        category="developer-tools"
        formLabel="Check index"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page or example.com"
            className={`${inputDark} flex-grow`}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Checking..." : "Check Index"}
          </button>
        </div>
        {error && <p className="mt-3 text-center text-red-400">{error}</p>}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl p-4 text-center">
              <Globe2 className="mx-auto mb-2 h-7 w-7 text-emerald-400" />
              <p className="text-sm text-slate-400">Target</p>
              <p className="break-all font-semibold text-white">{result.target}</p>
            </div>

            <div className="rounded-xl border bg-slate-900/60 p-4">
              <p className="mb-1 text-sm text-slate-400">Google site: query</p>
              <code className="block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-emerald-300">
                {result.query}
              </code>
              <a
                href={result.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Search
              </a>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
              <div className="flex items-start gap-2">
                {result.reachable ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400" />
                )}
                <div>
                  <p className="font-medium text-white">Reachability probe (no-cors)</p>
                  <p className="text-sm text-slate-400">
                    {result.reachable
                      ? "The URL responded to a browser fetch probe. This does not confirm Google indexing—use the site: link above."
                      : "Could not confirm reachability (network, CORS, or offline). The page may still be indexed; check Google with the site: query."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                Tips for Getting Indexed
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
                <li>Submit your sitemap in Google Search Console and request indexing for key URLs.</li>
                <li>Ensure the page returns 200, is not blocked by robots.txt or noindex, and is linked internally.</li>
                <li>Use descriptive titles, unique content, and HTTPS so crawlers can fetch confidently.</li>
                <li>Build a few quality referring links and share the URL on social or relevant communities.</li>
                <li>Fix soft 404s and duplicate canonical issues that can delay or prevent indexing.</li>
              </ul>
            </div>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="developer-tools"
        currentToolPath="/developer-tools/google-index-checker" />
    </>
  );
}
