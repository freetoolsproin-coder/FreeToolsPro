import { useState } from "react";
import {
  Activity,
  Loader2,
  CheckCircle2,
  XCircle,
  Gauge,
  MousePointerClick,
  Layout,
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

function gradeMetric(value, good, needs) {
  if (value <= good) return { status: "pass", label: "Good" };
  if (value <= needs) return { status: "warn", label: "Needs Improvement" };
  return { status: "fail", label: "Poor" };
}

export default function CoreWebVitalsChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
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

    await new Promise((r) => setTimeout(r, 1800));

    const seed = hashString(hostname);
    const lcp = 1.8 + (seed % 28) / 10;
    const inp = 120 + (seed % 340);
    const cls = ((seed % 35) / 100).toFixed(3);

    const lcpGrade = gradeMetric(lcp, 2.5, 4.0);
    const inpGrade = gradeMetric(inp, 200, 500);
    const clsGrade = gradeMetric(parseFloat(cls), 0.1, 0.25);

    const tips = [];
    if (lcpGrade.status !== "pass") {
      tips.push("Optimize LCP: compress hero images, preload critical assets, and reduce server TTFB.");
    }
    if (inpGrade.status !== "pass") {
      tips.push("Improve INP: break up long JavaScript tasks, defer non-critical scripts, and simplify event handlers.");
    }
    if (clsGrade.status !== "pass") {
      tips.push("Reduce CLS: set explicit width/height on images and ads, and avoid inserting content above existing layout.");
    }
    if (tips.length === 0) {
      tips.push("Core Web Vitals look healthy—keep monitoring after deploys and third-party script changes.");
    }

    const passCount = [lcpGrade, inpGrade, clsGrade].filter((g) => g.status === "pass").length;

    setResult({
      domain: hostname,
      lcp: lcp.toFixed(2),
      inp,
      cls,
      lcpGrade,
      inpGrade,
      clsGrade,
      tips,
      overall: passCount === 3 ? "pass" : passCount >= 1 ? "warn" : "fail",
    });
    setLoading(false);
  };

  const statusIcon = (status) => {
    if (status === "pass") return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
    if (status === "warn") return <Gauge className="h-5 w-5 text-amber-400" />;
    return <XCircle className="h-5 w-5 text-red-400" />;
  };

  return (
    <>
      <Seo page="coreWebVitalsChecker" />
      <ToolHeroShell
        icon={Activity}
        title="Core Web Vitals Checker"
        subtitle="Enter a URL to simulate LCP, INP, and CLS scores with pass/fail guidance."
        maxWidth="max-w-4xl"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className={`${inputDark} flex-grow`}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Check Vitals"}
          </button>
        </div>
        {error && <p className="mt-3 text-center text-red-400">{error}</p>}

        {loading && (
          <p className="mt-4 text-center text-sm text-slate-400">
            Simulating Core Web Vitals lab metrics…
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-slate-400">
              Demo results for <span className="font-semibold text-sky-400">{result.domain}</span>
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between">
                  <Layout className="h-5 w-5 text-sky-400" />
                  {statusIcon(result.lcpGrade.status)}
                </div>
                <p className="mt-2 text-sm text-slate-400">LCP (Largest Contentful Paint)</p>
                <p className="text-2xl font-bold text-white">{result.lcp}s</p>
                <p className="text-xs text-slate-500">{result.lcpGrade.label} · target ≤ 2.5s</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between">
                  <MousePointerClick className="h-5 w-5 text-violet-400" />
                  {statusIcon(result.inpGrade.status)}
                </div>
                <p className="mt-2 text-sm text-slate-400">INP (Interaction to Next Paint)</p>
                <p className="text-2xl font-bold text-white">{result.inp} ms</p>
                <p className="text-xs text-slate-500">{result.inpGrade.label} · target ≤ 200ms</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  {statusIcon(result.clsGrade.status)}
                </div>
                <p className="mt-2 text-sm text-slate-400">CLS (Cumulative Layout Shift)</p>
                <p className="text-2xl font-bold text-white">{result.cls}</p>
                <p className="text-xs text-slate-500">{result.clsGrade.label} · target ≤ 0.1</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <h3 className="mb-2 font-semibold text-white">Optimization Tips</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
                {result.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Browser-based demo estimates. Use Lighthouse or CrUX for official field data.
              </p>
            </div>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="developer-tools"
        currentToolPath="/developer-tools/core-web-vitals-checker" />
    </>
  );
}
