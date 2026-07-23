import { useState } from "react";
import { ShieldCheck, Loader2, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";
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

export default function SslChecker() {
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

    const httpsUrl = `https://${host}`;
    let httpsOk = false;
    let httpRedirects = false;

    try {
      await fetch(httpsUrl, { method: "HEAD", mode: "no-cors" });
      httpsOk = true;
    } catch {
      httpsOk = false;
    }

    try {
      await fetch(`http://${host}`, { method: "HEAD", mode: "no-cors" });
      httpRedirects = true;
    } catch {
      httpRedirects = false;
    }

    // Certificate details are not readable in-browser; provide practical SSL status checklist.
    setResult({
      domain: host,
      httpsOk,
      httpRedirects,
      grade: httpsOk ? "Likely Secure" : "Needs Attention",
      checks: [
        {
          label: "HTTPS endpoint reachable",
          ok: httpsOk,
          detail: httpsOk
            ? "The site responds over HTTPS from this browser."
            : "Could not confirm HTTPS reachability (network/CORS/offline).",
        },
        {
          label: "HTTP endpoint probe",
          ok: httpRedirects,
          detail: httpRedirects
            ? "HTTP endpoint responded (verify it redirects to HTTPS)."
            : "HTTP probe failed or blocked; verify redirect rules manually.",
        },
        {
          label: "HSTS / certificate details",
          ok: false,
          detail:
            "Full certificate chain, issuer, and expiry require a server-side SSL API. Use this tool as a first-pass check.",
        },
      ],
      tips: [
        "Install a valid certificate (Let's Encrypt or commercial CA).",
        "Force HTTPS redirects and enable HSTS.",
        "Keep TLS 1.2+ enabled and disable weak ciphers.",
        "Monitor certificate expiry before renewal deadlines.",
      ],
    });
    setLoading(false);
  };

  return (
    <>
      <Seo page="sslChecker" />
      <ToolHeroShell
        icon={ShieldCheck}
        title="SSL Checker"
        subtitle="Quickly check whether a domain appears to support HTTPS and review SSL best practices."
        category="developer-tools"
        formLabel="Check SSL"
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
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? "Checking..." : "Check SSL"}
          </button>
        </div>
        {error && <p className="mt-3 text-center text-red-400">{error}</p>}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl p-4 text-center">
              <Lock className="mx-auto mb-2 h-7 w-7 text-emerald-400" />
              <p className="text-sm text-slate-400">{result.domain}</p>
              <p className="text-xl font-bold text-white">{result.grade}</p>
            </div>

            <div className="space-y-2">
              {result.checks.map((check) => (
                <div
                  key={check.label}
                  className="rounded-xl border border-white/10 bg-slate-900/60 p-3"
                >
                  <div className="flex items-start gap-2">
                    {check.ok ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400" />
                    )}
                    <div>
                      <p className="font-medium text-white">{check.label}</p>
                      <p className="text-sm text-slate-400">{check.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <h3 className="mb-2 font-semibold text-white">SSL Best Practices</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
                {result.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent category="developer-tools" currentToolPath="/developer-tools/ssl-checker" />
    </>
  );
}
