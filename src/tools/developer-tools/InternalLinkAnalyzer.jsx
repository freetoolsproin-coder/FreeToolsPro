import { useState } from "react";
import {
  Link2,
  Loader2,
  Globe2,
  ExternalLink,
  ListTree,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark, textareaDark } from "../../components/ToolHeroShell";

function extractHost(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    const withProtocol = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
  }
}

function parseLinks(raw, baseHost) {
  const text = raw.trim();
  if (!text) return [];

  const hrefs = [];
  const anchorRe = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi;
  let match;
  let foundAnchors = false;
  while ((match = anchorRe.exec(text)) !== null) {
    foundAnchors = true;
    hrefs.push(match[2].trim());
  }

  if (!foundAnchors) {
    text.split(/\r?\n/).forEach((line) => {
      const t = line.trim();
      if (t && !t.startsWith("#")) hrefs.push(t);
    });
  }

  return hrefs
    .filter((h) => h && !h.startsWith("javascript:") && !h.startsWith("mailto:") && h !== "#")
    .map((href, index) => {
      let absolute = href;
      let host = "";
      let kind = "external";

      try {
        if (href.startsWith("//")) {
          absolute = `https:${href}`;
        } else if (href.startsWith("/") || href.startsWith("./") || href.startsWith("../")) {
          absolute = `https://${baseHost}${href.startsWith("/") ? "" : "/"}${href.replace(/^\.\//, "")}`;
          kind = "internal";
        } else if (!/^https?:\/\//i.test(href)) {
          // bare path or domain
          if (href.includes(".") && !href.includes(" ")) {
            absolute = href.startsWith("http") ? href : `https://${href}`;
          } else {
            absolute = `https://${baseHost}/${href.replace(/^\//, "")}`;
            kind = "internal";
          }
        }

        const u = new URL(absolute);
        host = u.hostname.replace(/^www\./, "").toLowerCase();
        if (host === baseHost || host.endsWith(`.${baseHost}`)) {
          kind = "internal";
        } else if (kind !== "internal") {
          kind = "external";
        }
      } catch {
        kind = href.startsWith("/") ? "internal" : "unknown";
        host = kind === "internal" ? baseHost : "";
        absolute = href;
      }

      return { id: index, href, absolute, host, kind };
    });
}

export default function InternalLinkAnalyzer() {
  const [baseDomain, setBaseDomain] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState(null);

  const handleAnalyze = async () => {
    const host = extractHost(baseDomain);
    if (!host || !host.includes(".")) {
      setError("Please enter a base domain (e.g., example.com).");
      return;
    }
    if (!input.trim()) {
      setError("Paste HTML with <a href> tags or a list of URLs (one per line).");
      return;
    }

    setError("");
    setLoading(true);
    setRows(null);
    await new Promise((r) => setTimeout(r, 400));
    setRows(parseLinks(input, host));
    setLoading(false);
  };

  const internal = rows?.filter((r) => r.kind === "internal").length ?? 0;
  const external = rows?.filter((r) => r.kind === "external").length ?? 0;
  const unknown = rows?.filter((r) => r.kind === "unknown").length ?? 0;

  return (
    <>
      <Seo page="internalLinkAnalyzer" />
      <ToolHeroShell
        icon={ListTree}
        title="Internal Link Analyzer"
        subtitle="Paste HTML or a URL list, set your base domain, and see internal vs external links with counts and a full table."
        category="developer-tools"
        formLabel="Analyze links"
      >
        <div className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-300"
              htmlFor="base-domain"
            >
              Base domain
            </label>
            <input
              id="base-domain"
              type="text"
              value={baseDomain}
              onChange={(e) => setBaseDomain(e.target.value)}
              placeholder="example.com"
              className={inputDark}
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-slate-300"
              htmlFor="link-input"
            >
              HTML or URL list
            </label>
            <textarea
              id="link-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              placeholder={'Paste HTML with <a href="..."> tags\nor one URL per line'}
              className={textareaDark}
            />
          </div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListTree className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Analyze Links"}
          </button>
        </div>

        {error && <p className="mt-3 text-center text-red-400">{error}</p>}

        {rows && (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl p-4 text-center">
                <Link2 className="mx-auto mb-2 h-6 w-6 text-violet-400" />
                <p className="text-sm text-slate-400">Total Links</p>
                <p className="text-2xl font-bold text-white">{rows.length}</p>
              </div>
              <div className="rounded-2xl p-4 text-center">
                <Globe2 className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
                <p className="text-sm text-slate-400">Internal</p>
                <p className="text-2xl font-bold text-white">{internal}</p>
              </div>
              <div className="rounded-2xl p-4 text-center">
                <ExternalLink className="mx-auto mb-2 h-6 w-6 text-sky-400" />
                <p className="text-sm text-slate-400">External</p>
                <p className="text-2xl font-bold text-white">
                  {external}
                  {unknown > 0 ? (
                    <span className="text-sm font-normal text-slate-400">
                      {" "}
                      (+{unknown} other)
                    </span>
                  ) : null}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-slate-300">Href</th>
                    <th className="px-4 py-2 font-semibold text-slate-300">Host</th>
                    <th className="px-4 py-2 font-semibold text-slate-300">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-slate-400">
                        No links found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-white/5 hover:bg-white/5"
                      >
                        <td className="max-w-md break-all px-4 py-2 text-white">{row.href}</td>
                        <td className="px-4 py-2 text-slate-300">{row.host || "—"}</td>
                        <td className="px-4 py-2">
                          <span
                            className={
                              row.kind === "internal"
                                ? "rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300"
                                : row.kind === "external"
                                  ? "rounded-full bg-sky-500/20 px-2 py-0.5 text-xs text-sky-300"
                                  : "rounded-full bg-slate-500/20 px-2 py-0.5 text-xs text-slate-300"
                            }
                          >
                            {row.kind}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="developer-tools"
        currentToolPath="/developer-tools/internal-link-analyzer" />
    </>
  );
}
