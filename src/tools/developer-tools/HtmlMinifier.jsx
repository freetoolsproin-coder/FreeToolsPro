import { useState, useMemo } from "react";
import { FileCode2, Minimize2, Trash2, ArrowDownUp } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

function minifyHtml(raw) {
  return raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+|\s+$/gm, "")
    .trim();
}

function formatBytes(chars) {
  const bytes = new Blob([chars]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
  <head>
    <title>Demo Page</title>
    <!-- Analytics snippet -->
  </head>
  <body>
    <h1>   Hello World   </h1>
    <p>   Minify this HTML.   </p>
  </body>
</html>`;

export default function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    if (!input.trim() || !output) return null;
    const before = new Blob([input]).size;
    const after = new Blob([output]).size;
    const saved = before - after;
    const pct = before > 0 ? ((saved / before) * 100).toFixed(1) : "0";
    return { before, after, saved, pct };
  }, [input, output]);

  const handleMinify = () => {
    if (!input.trim()) {
      setError("Please paste HTML to minify.");
      setOutput("");
      return;
    }
    setOutput(minifyHtml(input));
    setError("");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <>
      <Seo page="htmlMinifier" />
      <ToolHeroShell
        icon={FileCode2}
        title="HTML Minifier"
        subtitle="Remove comments and extra whitespace to shrink HTML payload size."
        maxWidth="max-w-5xl"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Input HTML</label>
              {input && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={SAMPLE_HTML}
              rows={14}
              className={textareaDark}
            />
            {input.trim() && (
              <p className="mt-1 text-xs text-slate-500">Before: {formatBytes(input)}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Minified Output</label>
            <textarea
              value={output}
              readOnly
              placeholder="Minified HTML will appear here…"
              rows={14}
              className={`${textareaDark} text-emerald-300`}
            />
            {output && <p className="mt-1 text-xs text-slate-500">After: {formatBytes(output)}</p>}
          </div>
        </div>

        {stats && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-center">
              <p className="text-xs text-slate-400">Original Size</p>
              <p className="text-lg font-bold text-white">{formatBytes(input)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-center">
              <p className="text-xs text-slate-400">Minified Size</p>
              <p className="text-lg font-bold text-emerald-400">{formatBytes(output)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-center">
              <p className="text-xs text-slate-400">Bytes Saved</p>
              <p className="flex items-center justify-center gap-1 text-lg font-bold text-sky-400">
                <ArrowDownUp className="h-4 w-4" />
                {stats.saved} B ({stats.pct}%)
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleMinify}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700"
          >
            <Minimize2 className="h-4 w-4" /> Minify HTML
          </button>
          {!input && (
            <button
              type="button"
              onClick={() => setInput(SAMPLE_HTML)}
              className="rounded-2xl border border-slate-600 px-5 py-3 text-sm text-slate-300 hover:border-sky-500"
            >
              Load sample
            </button>
          )}
        </div>
        {error && <p className="mt-3 text-center text-red-400">{error}</p>}
      </ToolHeroShell>

      <ToolPageContent category="developer-tools" currentToolPath="/developer-tools/html-minifier" />
    </>
  );
}
