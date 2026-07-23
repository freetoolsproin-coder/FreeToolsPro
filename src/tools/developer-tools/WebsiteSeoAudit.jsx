import { useState } from "react";
import {
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  Gauge,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";

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

export default function WebsiteSeoAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAudit = async () => {
    const target = normalizeUrl(url);
    if (!target) {
      setError("Please enter a website URL.");
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

    const isHttps = target.startsWith("https://");
    let httpsOk = false;
    try {
      await fetch(target.startsWith("https") ? target : `https://${hostname}`, {
        method: "HEAD",
        mode: "no-cors",
      });
      httpsOk = true;
    } catch {
      httpsOk = false;
    }

    await new Promise((r) => setTimeout(r, 1200));

    const seed = hashString(hostname);
    const titleOk = (seed % 10) > 2;
    const metaOk = (seed % 7) > 1;
    const mobileOk = (seed % 5) !== 0;
    const sitemapOk = (seed % 4) !== 0;
    const robotsOk = (seed % 6) !== 0;
    const speedOk = (seed % 8) > 2;

    const items = [
      {
        id: "https",
        label: "HTTPS enabled",
        pass: isHttps && httpsOk,
        tip: isHttps
          ? httpsOk
            ? "Site responds over HTTPS."
            : "HTTPS URL used, but the probe could not confirm reachability."
          : "Switch to HTTPS and redirect HTTP traffic.",
        weight: 15,
      },
      {
        id: "title",
        label: "Title length tips",
        pass: titleOk,
        tip: titleOk
          ? "Title length likely in a healthy ~50–60 character range (demo)."
          : "Aim for unique titles around 50–60 characters with a primary keyword.",
        weight: 15,
      },
      {
        id: "meta",
        label: "Meta description",
        pass: metaOk,
        tip: metaOk
          ? "Meta description appears present and useful (demo)."
          : "Add a compelling meta description (~120–160 characters) per page.",
        weight: 15,
      },
      {
        id: "mobile",
        label: "Mobile-friendly signals",
        pass: mobileOk,
        tip: mobileOk
          ? "Viewport / mobile readiness looks acceptable (demo)."
          : "Ensure a responsive viewport meta tag and tap-friendly layout.",
        weight: 15,
      },
      {
        id: "sitemap",
        label: "XML sitemap",
        pass: sitemapOk,
        tip: sitemapOk
          ? "Sitemap likely discoverable (demo estimate)."
          : "Publish /sitemap.xml and submit it in Google Search Console.",
        weight: 15,
      },
      {
        id: "robots",
        label: "robots.txt",
        pass: robotsOk,
        tip: robotsOk
          ? "robots.txt appears reachable / non-blocking (demo)."
          : "Add a clear robots.txt and avoid accidentally disallowing key paths.",
        weight: 10,
      },
      {
        id: "speed",
        label: "Speed tips",
        pass: speedOk,
        tip: speedOk
          ? "Performance baseline looks reasonable (demo)."
          : "Compress images, enable caching/CDN, and reduce blocking scripts.",
        weight: 15,
      },
    ];

    const score = items.reduce((sum, item) => sum + (item.pass ? item.weight : 0), 0);

    setResult({
      domain: hostname,
      target,
      score,
      grade: score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D",
      items,
      httpsProbed: httpsOk,
    });
    setLoading(false);
  };

  return (
    <>
      <Seo page="websiteSeoAudit" />
      <ToolHeroShell
        icon={ClipboardCheck}
        title="Website SEO Audit"
        subtitle="Run a quick checklist audit with demo scoring: HTTPS, titles, meta, mobile, sitemap, robots, and speed tips."
        category="developer-tools"
        formLabel="Run audit"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className={`${inputDark} flex-grow`}
            onKeyDown={(e) => e.key === "Enter" && handleAudit()}
          />
          <button
            type="button"
            onClick={handleAudit}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ClipboardCheck className="h-4 w-4" />
            )}
            {loading ? "Auditing..." : "Run SEO Audit"}
          </button>
        </div>
        {error && <p className="mt-3 text-center text-red-400">{error}</p>}

        {loading && (
          <p className="mt-4 text-center text-sm text-slate-400">
            Running checklist audit and HTTPS probe…
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-white/5 p-5 text-center">
              <Gauge className="mx-auto mb-2 h-8 w-8 text-orange-400" />
              <p className="text-sm text-slate-400">{result.domain}</p>
              <p className="text-3xl font-bold text-white">
                {result.score}
                <span className="text-lg text-slate-400"> / 100</span>
              </p>
              <p className="mt-1 text-sm font-medium text-orange-400">Grade {result.grade}</p>
            </div>

            <div className="space-y-2">
              {result.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-slate-900/60 p-3"
                >
                  <div className="flex items-start gap-2">
                    {item.pass ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    )}
                    <div>
                      <p className="font-medium text-white">
                        {item.label}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          ({item.pass ? "Pass" : "Fail"} · {item.weight} pts)
                        </span>
                      </p>
                      <p className="text-sm text-slate-400">{item.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Demo scoring with an HTTPS probe. Full HTML audits (live title/meta extraction)
              need a server-side fetch. Use this as a directional checklist, then verify in
              Search Console and Lighthouse.
            </p>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="developer-tools"
        currentToolPath="/developer-tools/website-seo-audit" />
    </>
  );
}
