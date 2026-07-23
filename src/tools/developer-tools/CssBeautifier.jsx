import { useState } from "react";
import { Paintbrush, Copy, Check, Sparkles, Trash2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

function beautifyCss(raw) {
  let css = raw
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, " {\n")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/\s*;\s*/g, ";\n  ")
    .replace(/\s*,\s*/g, ", ")
    .trim();

  const lines = css.split("\n");
  let indent = 0;
  const out = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("}")) {
      indent = Math.max(0, indent - 1);
      out.push("  ".repeat(indent) + trimmed);
      continue;
    }

    if (trimmed.includes("{")) {
      out.push("  ".repeat(indent) + trimmed);
      if (!trimmed.endsWith("}")) indent++;
      continue;
    }

    out.push("  ".repeat(indent) + trimmed);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

const SAMPLE_CSS = `.header{background:#1e293b;color:#fff;padding:1rem}.nav{display:flex;gap:1rem}.nav a{color:#38bdf8;text-decoration:none}`;

export default function CssBeautifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBeautify = () => {
    if (!input.trim()) {
      setError("Please paste some CSS to beautify.");
      setOutput("");
      return;
    }
    try {
      setOutput(beautifyCss(input));
      setError("");
    } catch {
      setError("Could not beautify CSS. Check for unbalanced braces.");
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <>
      <Seo page="cssBeautifier" />
      <ToolHeroShell
        icon={Paintbrush}
        title="CSS Beautifier"
        subtitle="Paste minified CSS and format it with clean indentation."
        maxWidth="max-w-5xl"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Input CSS</label>
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
              placeholder={SAMPLE_CSS}
              rows={14}
              className={textareaDark}
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Beautified Output</label>
              {output && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-sky-400"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Formatted CSS will appear here…"
              rows={14}
              className={`${textareaDark} text-emerald-300`}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleBeautify}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700"
          >
            <Sparkles className="h-4 w-4" /> Beautify CSS
          </button>
          {!input && (
            <button
              type="button"
              onClick={() => setInput(SAMPLE_CSS)}
              className="rounded-2xl border border-slate-600 px-5 py-3 text-sm text-slate-300 hover:border-sky-500"
            >
              Load sample
            </button>
          )}
        </div>
        {error && <p className="mt-3 text-center text-red-400">{error}</p>}
      </ToolHeroShell>

      <ToolPageContent category="developer-tools" currentToolPath="/developer-tools/css-beautifier" />
    </>
  );
}
