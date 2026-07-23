import { useState } from "react";
import { Check, Copy, AlertTriangle, Trash2, Download, Braces, Minimize2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const formatJSON = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
      setSuccessMsg("");
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setOutput("");
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
      setSuccessMsg("");
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      setOutput("");
    }
  };

  const validateJSON = () => {
    if (!input.trim()) {
      setError("Please enter some JSON to validate.");
      return;
    }
    try {
      JSON.parse(input);
      setError("");
      setSuccessMsg("Valid JSON configuration detected!");
      // Automatically format if valid and output is empty
      if (!output) {
        setOutput(JSON.stringify(JSON.parse(input), null, 2));
      }
    } catch (err) {
      setError(`Validation Error: ${err.message}`);
      setSuccessMsg("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setSuccessMsg("");
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Seo page="jsonFormatter" />

      <ToolHeroShell
        category="developer-tools"
        icon={Braces}
        title="JSON Formatter & Validator"
        subtitle="Clean, minify, validate, and convert raw JSON payloads instantly."
        formLabel="Format"
        layout="stack"
        wide
      >
          {/* Editor Workspace */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Input Panel */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                <span className="text-sm font-semibold text-white/70">Input JSON</span>
                {input && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs text-white/50 transition duration-150 hover:text-red-400 btnSmlText"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                )}
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name":"John","age":30,"hobbies":["coding","reading"]}'
                className="jsonTextarea h-80 w-full resize-none bg-transparent p-4 font-mono text-sm text-cyan-50 outline-none placeholder-white/30 transition-all focus:ring-1 focus:ring-[color:var(--hero-accent)]"
              />
            </div>

            {/* Output Panel */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border  bg-black backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-black/10 bg-black px-4 py-3">
                <span className="text-sm font-semibold text-white/70">Output Target</span>
                {output && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={copyOutput}
                      className="flex items-center gap-1 text-xs text-white/50 transition duration-150 hover:text-cyan-300 btnSmlText"
                      title="Copy JSON to Clipboard"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      <span className={copied ? "text-green-400" : ""}>
                        {copied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                    <button
                      onClick={downloadJSON}
                      className="flex items-center gap-1 text-xs text-white/50 transition duration-150 hover:text-cyan-300 btnSmlText"
                      title="Download JSON File"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                )}
              </div>
              <pre className="custom-scrollbar h-80 w-full overflow-auto bg-white p-4 font-mono text-sm text-black">
                {output || (
                  <span className="italic text-black/100">
                    Formatted or minified output will render here...
                  </span>
                )}
              </pre>
            </div>
          </div>

          {/* Functional Actions Bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={formatJSON}
              disabled={!input.trim()}
              className="flex items-center gap-2 rounded-xl bg-[var(--hero-accent)] px-5 py-2.5 font-medium text-[var(--ftp-ink)] transition duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              <Braces size={16} /> Pretty Print
            </button>

            <button
              onClick={minifyJSON}
              disabled={!input.trim()}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-white transition duration-150 hover:bg-white/10 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              <Minimize2 size={16} /> Minify
            </button>

            <button
              onClick={validateJSON}
              disabled={!input.trim()}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-white transition duration-150 hover:bg-white/10 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              <Check size={16} /> Validate JSON
            </button>
          </div>

          {/* Notifications Context (Errors & Success) */}
          <div className="mx-auto mt-6 min-h-[48px] max-w-xl">
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-800/60 bg-red-950/40 p-3 text-red-400 transition-all">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span className="font-mono text-xs">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-800/60 bg-emerald-950/40 p-3 text-emerald-400 transition-all">
                <Check
                  size={18}
                  className="shrink-0 rounded-full bg-emerald-500 p-0.5 text-gray-950"
                />
                <span className="text-sm font-medium">{successMsg}</span>
              </div>
            )}
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/json-formatter" />
    </>
  );
}
