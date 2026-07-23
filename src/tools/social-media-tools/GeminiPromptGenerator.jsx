import { useMemo, useState } from "react";
import { Wand2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

function buildGeminiPrompt({ goal, audience, tone, format, constraints }) {
  const parts = [];

  parts.push("You are Google Gemini acting as a focused assistant.");
  parts.push("");

  if (goal.trim()) {
    parts.push("Goal:");
    parts.push(goal.trim());
    parts.push("");
  }

  if (audience.trim()) {
    parts.push("Audience:");
    parts.push(audience.trim());
    parts.push("");
  }

  if (tone.trim()) {
    parts.push("Tone:");
    parts.push(tone.trim());
    parts.push("");
  }

  if (format.trim()) {
    parts.push("Output format:");
    parts.push(format.trim());
    parts.push("");
  }

  parts.push("Constraints:");
  if (constraints.trim()) {
    parts.push(constraints.trim());
  } else {
    parts.push("- Be accurate; state assumptions clearly");
    parts.push("- Stay concise unless detail is requested");
    parts.push("- Use plain language suited to the audience");
  }

  parts.push("");
  parts.push("Deliver the response in the requested format. Start with the main answer, then supporting detail.");

  return parts.join("\n");
}

export default function GeminiPromptGenerator() {
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Professional");
  const [format, setFormat] = useState("Bullet points with a short summary");
  const [constraints, setConstraints] = useState("");
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(
    () => buildGeminiPrompt({ goal, audience, tone, format, constraints }),
    [goal, audience, tone, format, constraints]
  );

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="geminiPromptGenerator" />

      <ToolHeroShell
        category="social-media-tools"
        icon={Wand2}
        title="Gemini Prompt Generator"
        subtitle="Structure goal, audience, tone, and constraints into a Gemini-ready prompt."
        formLabel="Prompt inputs"
        layout="stack"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
            <div>
              <label className={labelClass} htmlFor="gp-goal">
                Goal
              </label>
              <textarea
                id="gp-goal"
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What should Gemini produce or help with?"
                className={textareaDark}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="gp-audience">
                Audience
              </label>
              <input
                id="gp-audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Small business owners, beginners"
                className={inputDark}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="gp-tone">
                  Tone
                </label>
                <select
                  id="gp-tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className={selectDark}
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Concise</option>
                  <option>Educational</option>
                  <option>Persuasive</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="gp-format">
                  Output format
                </label>
                <select
                  id="gp-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className={selectDark}
                >
                  <option>Bullet points with a short summary</option>
                  <option>Short paragraph</option>
                  <option>Step-by-step instructions</option>
                  <option>Table-ready outline</option>
                  <option>JSON structure</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="gp-constraints">
                Constraints (optional)
              </label>
              <textarea
                id="gp-constraints"
                rows={3}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Word limits, must-include points, things to avoid..."
                className={textareaDark}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5 lg:sticky lg:top-24">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-[var(--ftp-ink)]">Generated prompt</h2>
              <button type="button" onClick={copyPrompt} className="age-btn-primary px-3 py-2 text-sm">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--ftp-line)] bg-white p-4 font-sans text-sm leading-7 text-[var(--ftp-ink)]">
              {prompt}
            </pre>
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/gemini-prompt-generator"
      />
    </>
  );
}
