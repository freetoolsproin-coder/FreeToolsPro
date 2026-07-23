import { useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Globe,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark, selectDark, textareaDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function parseHeaders(raw) {
  if (!raw.trim()) return {};
  const parsed = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Headers must be a JSON object.");
  }
  const headers = {};
  for (const [key, value] of Object.entries(parsed)) {
    headers[key] = String(value);
  }
  return headers;
}

function formatBody(raw, method) {
  if (!raw.trim() || method === "GET" || method === "HEAD") return undefined;
  return raw;
}

export default function ApiTester() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSend = async () => {
    const target = normalizeUrl(url);
    if (!target) {
      setError("Please enter an API URL.");
      return;
    }

    let parsedHeaders = {};
    try {
      parsedHeaders = parseHeaders(headers);
    } catch (e) {
      setError(e.message || "Invalid headers JSON.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const start = performance.now();

    try {
      const options = {
        method,
        headers: parsedHeaders,
        mode: "cors",
      };

      const payload = formatBody(body, method);
      if (payload !== undefined) {
        options.body = payload;
      }

      const res = await fetch(target, options);
      const elapsed = Math.round(performance.now() - start);

      const contentType = res.headers.get("content-type") || "";
      let responseText = "";
      try {
        responseText = await res.text();
      } catch {
        responseText = "(Could not read response body)";
      }

      let formatted = responseText;
      if (contentType.includes("json")) {
        try {
          formatted = JSON.stringify(JSON.parse(responseText), null, 2);
        } catch {
          formatted = responseText;
        }
      }

      const responseHeaders = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResult({
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        elapsed,
        headers: responseHeaders,
        body: formatted,
        corsBlocked: false,
      });
    } catch (e) {
      const elapsed = Math.round(performance.now() - start);
      const msg = e.message || "Request failed";
      const isCors =
        msg.includes("CORS") ||
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        msg.toLowerCase().includes("network");

      setResult({
        ok: false,
        status: null,
        statusText: isCors ? "CORS / Network Error" : "Error",
        elapsed,
        headers: {},
        body: "",
        corsBlocked: isCors,
        errorDetail: isCors
          ? "The browser blocked this request—likely due to CORS policy, mixed content, or an unreachable host. The API must send Access-Control-Allow-Origin for browser calls, or test from server-side/postman."
          : msg,
      });
    }

    setLoading(false);
  };

  const showBody = method !== "GET" && method !== "HEAD";

  return (
    <>
      <Seo page="apiTester" />
      <ToolHeroShell
        icon={Send}
        title="API Tester"
        subtitle="Send HTTP requests with custom method, headers, and body—see status and response inline."
        maxWidth="max-w-5xl"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`${selectDark} w-full sm:w-36`}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/users"
            className={`${inputDark} flex-grow`}
            onKeyDown={(e) => e.key === "Enter" && !showBody && handleSend()}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Headers (JSON)</label>
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              rows={6}
              className={textareaDark}
              spellCheck={false}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Request Body {showBody ? "" : "(not used for GET/HEAD)"}
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              disabled={!showBody}
              placeholder='{"name": "Jane"}'
              className={`${textareaDark} disabled:opacity-50`}
              spellCheck={false}
            />
          </div>
        </div>

        {error && <p className="mt-3 text-center text-red-400">{error}</p>}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {result.ok ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <span className="text-lg font-bold text-white">
                {result.status !== null ? `${result.status} ${result.statusText}` : result.statusText}
              </span>
              <span className="text-sm text-slate-400">{result.elapsed} ms</span>
            </div>

            {result.corsBlocked && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-sm text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{result.errorDetail}</span>
              </div>
            )}

            {!result.corsBlocked && Object.keys(result.headers).length > 0 && (
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                  <Globe className="h-4 w-4" /> Response Headers
                </h3>
                <pre className="max-h-32 overflow-auto font-mono text-xs text-slate-400">
                  {JSON.stringify(result.headers, null, 2)}
                </pre>
              </div>
            )}

            {result.body && (
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                <h3 className="mb-2 text-sm font-semibold text-white">Response Body</h3>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap font-mono text-xs text-emerald-300">
                  {result.body}
                </pre>
              </div>
            )}

            {result.errorDetail && !result.corsBlocked && (
              <p className="text-sm text-red-400">{result.errorDetail}</p>
            )}
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent category="developer-tools" currentToolPath="/developer-tools/api-tester" />
    </>
  );
}
