import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

function optimizePrompt(raw) {
  const task = raw.trim();
  if (!task) return "";

  const roleHint = task.length > 120 ? "a senior domain expert" : "a helpful specialist assistant";

  return `Role:
You are ${roleHint} with strong reasoning, clear communication, and practical problem-solving skills.

Task:
${task}

Constraints:
- Stay accurate and avoid guessing when information is missing
- Be concise but complete; prioritize the most useful details first
- Use plain language unless technical terms are required
- Flag assumptions explicitly instead of presenting them as facts

Output Format:
- Start with a direct answer or summary
- Use short sections or bullet points for supporting detail
- End with actionable next steps or a checklist when relevant`;
}

export default function AiPromptOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setOutput(optimizePrompt(input));
    setLoading(false);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="aiPromptOptimizer" />

      <ToolHeroShell
        icon={Sparkles}
        title="AI Prompt Optimizer"
        subtitle="Restructure rough prompts with role, constraints, and a clear output format."
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="prompt-optimizer-input">
              Your Prompt
            </label>
            <textarea
              id="prompt-optimizer-input"
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Write a LinkedIn post about remote work productivity tips"
              className={textareaDark}
            />
          </div>

          <button
            type="button"
            onClick={handleOptimize}
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Optimizing..." : "Optimize Prompt"}
          </button>

          {output && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-white">Optimized Prompt</h2>
                <button
                  type="button"
                  onClick={copyOutput}
                  className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">{output}</pre>
            </div>
          )}
        </div>
      </ToolHeroShell>

      <ToolPageContent category="social-media-tools" currentToolPath="/social-media-tools/ai-prompt-optimizer" />
    </>
  );
}
