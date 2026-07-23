import { useState } from "react";
import { Activity, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

/**
 * Measure fetch latency with mode: 'no-cors' (opaque response) and AbortController timeout.
 * Browser CORS still limits what you can inspect; timing of the request completion is usable.
 */
async function pingOnce(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();
  try {
    await fetch(url, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return { ok: true, ms: performance.now() - start };
  } catch (err) {
    const ms = performance.now() - start;
    if (err?.name === "AbortError") {
      return { ok: false, ms, error: "Timed out" };
    }
    return { ok: false, ms, error: err?.message || "Request failed" };
  } finally {
    clearTimeout(timer);
  }
}

function normalizeUrl(raw) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function PingTool() {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(3);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = (() => {
    const ok = results.filter((r) => r.ok);
    if (!ok.length) return null;
    const times = ok.map((r) => r.ms);
    const sum = times.reduce((a, b) => a + b, 0);
    return {
      avg: sum / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      success: ok.length,
      total: results.length,
    };
  })();

  const summaryText = (() => {
    if (!results.length) return "";
    const lines = results.map(
      (r, i) =>
        `#${i + 1}: ${r.ok ? "ok" : "fail"} ${r.ms.toFixed(1)} ms${r.error ? ` (${r.error})` : ""}`
    );
    if (stats) {
      lines.push(
        "",
        `avg ${stats.avg.toFixed(1)} ms | min ${stats.min.toFixed(1)} ms | max ${stats.max.toFixed(1)} ms`,
        `success ${stats.success}/${stats.total}`
      );
    }
    return lines.join("\n");
  })();

  const runPings = async () => {
    const target = normalizeUrl(url);
    if (!target) {
      setError("Enter a URL to ping.");
      setResults([]);
      return;
    }
    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      setError("Invalid URL.");
      setResults([]);
      return;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      setError("Only http and https URLs are supported.");
      setResults([]);
      return;
    }

    const n = Math.min(20, Math.max(1, Number(count) || 1));
    setError("");
    setRunning(true);
    setResults([]);

    const collected = [];
    for (let i = 0; i < n; i += 1) {
      const r = await pingOnce(parsed.href);
      collected.push(r);
      setResults([...collected]);
    }
    setRunning(false);
  };

  const handleCopy = async () => {
    if (!summaryText) return;
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="pingTool" />

      <ToolHeroShell
        icon={Activity}
        title="Ping Tool"
        subtitle="Measure browser fetch latency to a URL (avg / min / max). Uses no-cors mode with AbortController timing."
        category="developer-tools"
        layout="stack"
        formLabel="Ping URL"
      >
        <p className="mb-4 rounded-[14px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Note: Browsers enforce CORS. With <code className="font-mono">mode: &quot;no-cors&quot;</code>, responses are
          opaque—you cannot read status or body. Timing still reflects round-trip completion, but it is not a true ICMP
          ping and may be blocked by network policy.
        </p>

        <div className="grid gap-4 sm:grid-cols-[1fr_120px_auto]">
          <div>
            <label htmlFor="ping-url" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              URL
            </label>
            <input
              id="ping-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={inputDark}
            />
          </div>
          <div>
            <label htmlFor="ping-count" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Count
            </label>
            <input
              id="ping-count"
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className={inputDark}
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={runPings}
              disabled={running}
              className="age-btn w-full px-4 py-3 text-sm sm:w-auto"
            >
              {running ? "Pinging…" : "Ping"}
            </button>
          </div>
        </div>

        {stats ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-3">
              <p className="text-xs text-[var(--ftp-ink-soft)]">Average</p>
              <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">{stats.avg.toFixed(1)} ms</p>
            </div>
            <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-3">
              <p className="text-xs text-[var(--ftp-ink-soft)]">Min</p>
              <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">{stats.min.toFixed(1)} ms</p>
            </div>
            <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-3">
              <p className="text-xs text-[var(--ftp-ink-soft)]">Max</p>
              <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">{stats.max.toFixed(1)} ms</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--ftp-ink-soft)]">Results</span>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!summaryText}
              className="age-btn-ghost px-3 py-1.5 text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li
                key={`ping-${i}`}
                className="rounded-[14px] border border-[var(--ftp-line)] px-3 py-2 text-sm text-[var(--ftp-ink)]"
              >
                #{i + 1}: {r.ok ? "ok" : "fail"} — {r.ms.toFixed(1)} ms
                {r.error ? ` (${r.error})` : ""}
              </li>
            ))}
            {!results.length && !running ? (
              <li className="text-sm text-[var(--ftp-ink-soft)]">Ping results will appear here…</li>
            ) : null}
          </ul>
        </div>

        {error ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {error}
          </p>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/ping-tool"
        faqs={[
          { q: "Is this Ping Tool free?", a: "Yes. Measure fetch latency with no signup." },
          {
            q: "Is this real ICMP ping?",
            a: "No. Browsers cannot send ICMP. This times HTTP(S) fetch requests with no-cors mode.",
          },
          {
            q: "Why mention CORS?",
            a: "CORS limits reading response details. Timing still works for opaque responses, but some hosts may block or delay requests.",
          },
        ]}
      />
    </>
  );
}
