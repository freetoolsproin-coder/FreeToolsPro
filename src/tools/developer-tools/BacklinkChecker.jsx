import { useState } from "react";
import {
  Link2,
  Loader2,
  Globe2,
  ExternalLink,
  CheckCircle2,
  Ban,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";

function extractHost(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    const withProtocol = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

const SAMPLE_REFERRERS = [
  { domain: "techcrunch.com", links: 12, type: "dofollow" },
  { domain: "medium.com", links: 8, type: "dofollow" },
  { domain: "reddit.com", links: 15, type: "nofollow" },
  { domain: "github.com", links: 6, type: "dofollow" },
  { domain: "wikipedia.org", links: 3, type: "nofollow" },
  { domain: "producthunt.com", links: 4, type: "dofollow" },
  { domain: "dev.to", links: 7, type: "dofollow" },
  { domain: "news.ycombinator.com", links: 5, type: "nofollow" },
];

function hashDomain(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export default function BacklinkChecker() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    const host = extractHost(domain);
    if (!host || !host.includes(".")) {
      setError("Please enter a valid domain (e.g., example.com).");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1400));

    const seed = hashDomain(host);
    const referringDomains = 40 + (seed % 220);
    const estimatedBacklinks = referringDomains * (3 + (seed % 8)) + (seed % 50);
    const dofollow = Math.round(estimatedBacklinks * (0.55 + (seed % 20) / 100));
    const nofollow = estimatedBacklinks - dofollow;

    const shuffled = [...SAMPLE_REFERRERS]
      .map((item, i) => ({
        ...item,
        links: item.links + ((seed + i * 7) % 9),
      }))
      .sort((a, b) => b.links - a.links)
      .slice(0, 6);

    setResult({
      domain: host,
      referringDomains,
      estimatedBacklinks,
      dofollow,
      nofollow,
      topReferrers: shuffled,
    });
    setLoading(false);
  };

  return (
    <>
      <Seo page="backlinkChecker" />
      <ToolHeroShell
        icon={Link2}
        title="Backlink Checker"
        subtitle="Demo only: hashed estimates and sample referrers—not Ahrefs, Moz, or live crawl data."
        category="developer-tools"
        formLabel="Check backlinks"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
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
            {loading ? "Analyzing..." : "Check Backlinks"}
          </button>
        </div>
        {error && <p className="mt-3 text-center text-red-400">{error}</p>}

        {loading && (
          <p className="mt-4 text-center text-sm text-slate-400">
            Simulating backlink analysis… this may take a moment.
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-400">Backlink estimate for</p>
              <p className="text-xl font-bold text-sky-400">{result.domain}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl p-4 text-center">
                <Globe2 className="mx-auto mb-2 h-6 w-6 text-sky-400" />
                <p className="text-sm text-slate-400">Referring Domains</p>
                <p className="text-2xl font-bold text-white">
                  {result.referringDomains.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl p-4 text-center">
                <ExternalLink className="mx-auto mb-2 h-6 w-6 text-indigo-400" />
                <p className="text-sm text-slate-400">Est. Backlinks</p>
                <p className="text-2xl font-bold text-white">
                  {result.estimatedBacklinks.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl p-4 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
                <p className="text-sm text-slate-400">Dofollow (sample)</p>
                <p className="text-2xl font-bold text-white">
                  {result.dofollow.toLocaleString()}
                </p>
              </div>
              <div className="rounded-2xl p-4 text-center">
                <Ban className="mx-auto mb-2 h-6 w-6 text-amber-400" />
                <p className="text-sm text-slate-400">Nofollow (sample)</p>
                <p className="text-2xl font-bold text-white">
                  {result.nofollow.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-slate-300">Top Referring Domains</th>
                    <th className="px-4 py-2 font-semibold text-slate-300">Links</th>
                    <th className="px-4 py-2 font-semibold text-slate-300">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {result.topReferrers.map((row) => (
                    <tr
                      key={row.domain}
                      className="border-t border-white/5 hover:bg-white/5"
                    >
                      <td className="px-4 py-2 text-white">{row.domain}</td>
                      <td className="px-4 py-2 text-slate-300">{row.links}</td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            row.type === "dofollow"
                              ? "rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300"
                              : "rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300"
                          }
                        >
                          {row.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500">
              Note: These figures are demo estimates for illustration when live backlink APIs are
              unavailable. Use a dedicated SEO platform for production link audits.
            </p>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent category="developer-tools" currentToolPath="/developer-tools/backlink-checker" />
    </>
  );
}
