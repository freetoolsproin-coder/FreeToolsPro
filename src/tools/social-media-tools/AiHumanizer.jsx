import { useState } from "react";
import { UserRound, Copy, Check, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

const CONTRACTIONS = [
  [/\bI am\b/gi, "I'm"],
  [/\bYou are\b/gi, "You're"],
  [/\bWe are\b/gi, "We're"],
  [/\bThey are\b/gi, "They're"],
  [/\bIt is\b/gi, "It's"],
  [/\bThat is\b/gi, "That's"],
  [/\bThere is\b/gi, "There's"],
  [/\bDo not\b/gi, "Don't"],
  [/\bDoes not\b/gi, "Doesn't"],
  [/\bDid not\b/gi, "Didn't"],
  [/\bCannot\b/gi, "Can't"],
  [/\bCould not\b/gi, "Couldn't"],
  [/\bWould not\b/gi, "Wouldn't"],
  [/\bShould not\b/gi, "Shouldn't"],
  [/\bWill not\b/gi, "Won't"],
  [/\bIs not\b/gi, "Isn't"],
  [/\bAre not\b/gi, "Aren't"],
  [/\bWas not\b/gi, "Wasn't"],
  [/\bWere not\b/gi, "Weren't"],
  [/\bHave not\b/gi, "Haven't"],
  [/\bHas not\b/gi, "Hasn't"],
  [/\bHad not\b/gi, "Hadn't"],
  [/\bI will\b/gi, "I'll"],
  [/\bYou will\b/gi, "You'll"],
  [/\bWe will\b/gi, "We'll"],
];

const SIMPLE_WORDS = [
  [/\butilize\b/gi, "use"],
  [/\bimplement\b/gi, "add"],
  [/\bfacilitate\b/gi, "help"],
  [/\bcommence\b/gi, "start"],
  [/\bterminate\b/gi, "end"],
  [/\bendeavor\b/gi, "try"],
  [/\bapproximately\b/gi, "about"],
  [/\bsubsequently\b/gi, "then"],
  [/\bnevertheless\b/gi, "still"],
  [/\bfurthermore\b/gi, "also"],
  [/\btherefore\b/gi, "so"],
  [/\bregarding\b/gi, "about"],
  [/\bpertaining to\b/gi, "about"],
  [/\bin order to\b/gi, "to"],
  [/\ba number of\b/gi, "several"],
  [/\bprior to\b/gi, "before"],
  [/\bdue to the fact that\b/gi, "because"],
];

function varySentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence, i) => {
      const trimmed = sentence.trim();
      if (!trimmed) return "";
      if (i % 3 === 0 && trimmed.length > 100) {
        const mid = trimmed.indexOf(",", Math.floor(trimmed.length / 2));
        if (mid > 40) {
          return `${trimmed.slice(0, mid + 1).trim()} ${trimmed.slice(mid + 1).trim()}`;
        }
      }
      if (i % 4 === 2 && trimmed.length < 60 && !trimmed.endsWith("!")) {
        return trimmed.replace(/\.$/, "!");
      }
      return trimmed;
    })
    .filter(Boolean)
    .join(" ");
}

function humanizeText(raw) {
  let text = raw.trim();
  if (!text) return "";

  for (const [pattern, replacement] of SIMPLE_WORDS) {
    text = text.replace(pattern, replacement);
  }
  for (const [pattern, replacement] of CONTRACTIONS) {
    text = text.replace(pattern, replacement);
  }

  text = text
    .replace(/\bIn conclusion,\s*/gi, "So, ")
    .replace(/\bAdditionally,\s*/gi, "Also, ")
    .replace(/\bMoreover,\s*/gi, "Plus, ")
    .replace(/\bIt is important to note that\s*/gi, "")
    .replace(/\bIn today's (digital )?world,?\s*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return varySentences(text);
}

export default function AiHumanizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleHumanize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setOutput(humanizeText(input));
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
      <Seo page="aiHumanizer" />

      <ToolHeroShell
        icon={UserRound}
        title="AI Text Humanizer"
        subtitle="Make AI-generated writing sound more natural with contractions, simpler words, and varied sentence rhythm."
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="humanizer-input">
              AI-Generated Text
            </label>
            <textarea
              id="humanizer-input"
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste robotic or overly formal AI text here..."
              className={textareaDark}
            />
          </div>

          <button
            type="button"
            onClick={handleHumanize}
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
            {loading ? "Humanizing..." : "Humanize Text"}
          </button>

          {output && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-white">Humanized Output</h2>
                <button
                  type="button"
                  onClick={copyOutput}
                  className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{output}</p>
              <p className="mt-3 text-xs text-slate-500">
                Rules-based demo: adds contractions, swaps formal words, and varies sentence length. Always review before publishing.
              </p>
            </div>
          )}
        </div>
      </ToolHeroShell>

      <ToolPageContent category="social-media-tools" currentToolPath="/social-media-tools/ai-humanizer" />
    </>
  );
}
