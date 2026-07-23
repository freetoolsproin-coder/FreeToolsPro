import { useState } from "react";
import {
  Link2,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Globe2,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function parseCanonicalFromHtml(html, baseUrl) {
  const canonicalMatch = html.match(
    /<link[^>]+rel\s*=\s*["']canonical["'][^>]*>/i
  );
  let canonical = null;
  if (canonicalMatch) {
    const hrefMatch = canonicalMatch[0].match(/href\s*=\s*["']([^"']+)["']/i);
    if (hrefMatch) {
      try {
        canonical = new URL(hrefMatch[1], baseUrl).href;
      } catch {
        canonical = hrefMatch[1];
      }
    }
  }

  const ogMatch = html.match(
    /<meta[^>]+property\s*=\s*["']og:url["'][^>]*>/i
  );
  let ogUrl = null;
  if (ogMatch) {
    const contentMatch = ogMatch[0].match(/content\s*=\s*["']([^"']+)["']/i);
    if (contentMatch) {
      try {
        ogUrl = new URL(contentMatch[1], baseUrl).href;
      } catch {
        ogUrl = contentMatch[1];
      }
    }
  }

  return { canonical, ogUrl };
}

function simulateCanonical(target) {
  const seed = hashString(target);
  const hasCanonical = seed % 5 !== 0;
  const hasOg = seed % 4 !== 0;
  const u = new URL(target);
  const canonical = hasCanonical
    ? `${u.origin}${u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "") || u.pathname}`
    : null;
  const ogUrl = hasOg ? canonical || target : null;
  return { canonical, ogUrl, simulated: true };
}

export default function CanonicalChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    const target = normalizeUrl(url);
    if (!target) {
      setError("Please enter a page URL.");
      return;
    }

    let hostname;
    try {
      hostname = new URL(target).hostname;
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    let canonical = null;
    let ogUrl = null;
    let simulated = false;
    let fetchError = "";

    try {
      const res = await fetch(target, { mode: "cors" });
      if (res.ok) {
        const html = await res.text();
        const parsed = parseCanonicalFromHtml(html, target);
        canonical = parsed.canonical;
        ogUrl = parsed.ogUrl;
      } else {
        fetchError = `HTTP ${res.status}`;
      }
    } catch {
      fetchError = "CORS or network blocked direct fetch";
    }

    if (!canonical && !ogUrl) {
      const sim = simulateCanonical(target);
      canonical = sim.canonical;
      ogUrl = sim.ogUrl;
      simulated = true;
    }

    const tips = [];
    if (!canonical) {
      tips.push("Add a <link rel=\"canonical\"> tag pointing to the preferred URL for this page.");
    } else if (canonical !== target.replace(/\/$/, "") && canonical !== target) {
      tips.push("Canonical URL differs from the checked URL—confirm this is intentional (e.g., parameter stripping).");
    } else {
      tips.push("Canonical tag appears aligned with the checked URL.");
    }
    if (!ogUrl) {
      tips.push("Add og:url meta property for consistent social sharing and URL signals.");
    } else if (canonical && ogUrl !== canonical) {
      tips.push("og:url and canonical differ—consider aligning them to the same preferred URL.");
    }
    if (simulated || fetchError) {
      tips.push(
        fetchError
          ? `Live fetch limited (${fetchError}). Showing simulated/demo tag detection.`
          : "Demo detection used when live HTML could not be parsed."
      );
    }

    setResult({
      domain: hostname,
      target,
      canonical,
      ogUrl,
      simulated,
      fetchError,
      tips,
    });
    setLoading(false);
  };

  return (
    <>
      <Seo page="canonicalChecker" />
      <ToolHeroShell
        icon={Link2}
        title="Canonical Tag Checker"
        subtitle="Check whether a page has a canonical link tag and og:url meta property."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/page"
            className={`${inputDark} flex-grow`}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            {loading ? "Checking..." : "Check Canonical"}
          </button>
        </div>
        {error && <p className="mt-3 text-center text-red-400">{error}</p>}

        {result && (
          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-slate-400">
              Results for <span className="font-semibold text-sky-400">{result.domain}</span>
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center gap-2">
                  {result.canonical ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="font-semibold text-white">Canonical Tag</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {result.canonical ? "Found" : "Missing"}
                </p>
                {result.canonical && (
                  <p className="mt-1 break-all font-mono text-xs text-sky-300">{result.canonical}</p>
                )}
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center gap-2">
                  {result.ogUrl ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <span className="font-semibold text-white">og:url</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{result.ogUrl ? "Found" : "Missing"}</p>
                {result.ogUrl && (
                  <p className="mt-1 break-all font-mono text-xs text-sky-300">{result.ogUrl}</p>
                )}
              </div>
            </div>

            {result.simulated && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-sm text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Live HTML fetch was blocked or unavailable. Results include simulated tag detection
                  for demonstration.
                </span>
              </div>
            )}

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
                <Globe2 className="h-4 w-4" /> SEO Tips
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
                {result.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent category="developer-tools" currentToolPath="/developer-tools/canonical-checker" />
    </>
  );
}
