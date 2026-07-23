import { useState } from "react";
import { Gauge, Loader2, Layout, MousePointerClick, Activity } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function gradeMetric(value, good, needs) {
  if (value <= good) return { status: "pass", label: "Good" };
  if (value <= needs) return { status: "warn", label: "Needs Improvement" };
  return { status: "fail", label: "Poor" };
}

function analyze(hostname) {
  const seed = hashString(hostname);
  const score = 35 + (seed % 61);
  const lcp = 1.6 + (seed % 32) / 10;
  const inp = 100 + (seed % 380);
  const cls = ((seed % 40) / 100).toFixed(3);

  const lcpGrade = gradeMetric(lcp, 2.5, 4.0);
  const inpGrade = gradeMetric(inp, 200, 500);
  const clsGrade = gradeMetric(parseFloat(cls), 0.1, 0.25);

  const tips = [];
  if (score < 70) {
    tips.push("Reduce render-blocking resources and defer non-critical JavaScript.");
  }
  if (lcpGrade.status !== "pass") {
    tips.push("Improve LCP: optimize hero images, preload key assets, and reduce server response time.");
  }
  if (inpGrade.status !== "pass") {
    tips.push("Improve INP: split long tasks, simplify event handlers, and limit third-party scripts.");
  }
  if (clsGrade.status !== "pass") {
    tips.push("Reduce CLS: reserve space for images and ads with explicit dimensions.");
  }
  if (tips.length === 0) {
    tips.push("Performance metrics look healthy. Keep monitoring after deploys and content changes.");
  }

  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D";

  return {
    domain: hostname,
    score,
    grade,
    lcp: lcp.toFixed(2),
    inp,
    cls,
    lcpGrade,
    inpGrade,
    clsGrade,
    tips,
  };
}

export default function PageSpeedAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
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

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setResult(analyze(hostname));
    setLoading(false);
  };

  const statusClass = (status) => {
    if (status === "pass") return "text-[var(--ftp-teal)]";
    if (status === "warn") return "text-[var(--ftp-ink-soft)]";
    return "text-[var(--ftp-ink)]";
  };

  return (
    <>
      <Seo page="pageSpeedAnalyzer" />

      <ToolHeroShell
        icon={Gauge}
        title="Page Speed Analyzer"
        subtitle="Enter a URL for a deterministic demo performance score with LCP, INP, and CLS estimates."
        category="developer-tools"
        layout="stack"
        formLabel="Analyze URL"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className={`${inputDark} flex-grow`}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="age-btn-primary whitespace-nowrap"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gauge className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error ? (
          <p className="mt-3 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-4 text-center text-sm text-[var(--ftp-ink-soft)]">
            Generating deterministic demo metrics...
          </p>
        ) : null}

        {result ? (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-[var(--ftp-ink-soft)]">Estimate for</p>
              <p className="text-xl font-semibold text-[var(--ftp-ink)]">{result.domain}</p>
            </div>

            <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-5 text-center">
              <p className="text-sm text-[var(--ftp-ink-soft)]">Performance score</p>
              <p className="age-display mt-1 text-4xl font-semibold text-[var(--ftp-teal)]">
                {result.score}
                <span className="ml-2 text-lg text-[var(--ftp-ink-soft)]">({result.grade})</span>
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[14px] border border-[var(--ftp-line)] bg-white p-4">
                <Layout className="h-5 w-5 text-[var(--ftp-teal)]" aria-hidden="true" />
                <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">LCP</p>
                <p className="text-2xl font-semibold text-[var(--ftp-ink)]">{result.lcp}s</p>
                <p className={`text-xs ${statusClass(result.lcpGrade.status)}`}>
                  {result.lcpGrade.label}
                </p>
              </div>
              <div className="rounded-[14px] border border-[var(--ftp-line)] bg-white p-4">
                <MousePointerClick className="h-5 w-5 text-[var(--ftp-teal)]" aria-hidden="true" />
                <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">INP</p>
                <p className="text-2xl font-semibold text-[var(--ftp-ink)]">{result.inp} ms</p>
                <p className={`text-xs ${statusClass(result.inpGrade.status)}`}>
                  {result.inpGrade.label}
                </p>
              </div>
              <div className="rounded-[14px] border border-[var(--ftp-line)] bg-white p-4">
                <Activity className="h-5 w-5 text-[var(--ftp-teal)]" aria-hidden="true" />
                <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">CLS</p>
                <p className="text-2xl font-semibold text-[var(--ftp-ink)]">{result.cls}</p>
                <p className={`text-xs ${statusClass(result.clsGrade.status)}`}>
                  {result.clsGrade.label}
                </p>
              </div>
            </div>

            <div className="rounded-[14px] border border-[var(--ftp-line)] bg-white p-4">
              <h3 className="font-semibold text-[var(--ftp-ink)]">Optimization tips</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ftp-ink-soft)]">
                {result.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-[var(--ftp-ink-soft)]">
                These scores are deterministic estimates derived from the URL string hash, not a live audit.
                Use Lighthouse or PageSpeed Insights for official measurements.
              </p>
            </div>
          </div>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/page-speed-analyzer"
      />
    </>
  );
}
