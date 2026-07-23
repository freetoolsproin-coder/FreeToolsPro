import { useState } from "react";
import { FileText, Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";

const TYPES = ["Argumentative", "Expository", "Persuasive", "Descriptive", "Compare & Contrast"];
const LEVELS = ["High School", "College", "Professional"];

const inputClass =
  "w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25 placeholder:text-slate-500";

function generateEssay({ topic, type, level, wordTarget }) {
  const t = topic.trim();
  const intro = `In today's rapidly changing world, ${t} has become an important subject of discussion. This ${type.toLowerCase()} essay examines the key ideas, challenges, and implications related to ${t} from a ${level.toLowerCase()} perspective.`;

  const body1 = `First, understanding ${t} requires looking at its background and practical relevance. People encounter aspects of ${t} in education, work, and daily decision-making. Clear definitions and real examples help separate myths from facts and establish a solid foundation for deeper analysis.`;

  const body2 = `Furthermore, ${t} influences outcomes across communities and industries. Supporters argue that thoughtful engagement with ${t} can unlock opportunities, improve efficiency, and encourage innovation. Critics, however, highlight risks such as unequal access, misuse of information, and unintended consequences if policies or habits remain poorly designed.`;

  const body3 =
    wordTarget === "long"
      ? `Additionally, evidence from recent studies and practical case examples suggests that balanced approaches work best. Stakeholders should combine critical thinking, ethical guidelines, and continuous learning when addressing ${t}. Collaboration between individuals, institutions, and technology providers can reduce gaps and amplify benefits.`
      : `In practice, progress around ${t} depends on informed choices, responsible habits, and open dialogue among stakeholders.`;

  const conclusion = `In conclusion, ${t} is more than a trend—it is a meaningful topic that deserves careful attention. By evaluating both opportunities and challenges, readers can form reasoned opinions and take constructive action. Continued learning about ${t} will remain valuable as society evolves.`;

  return [intro, body1, body2, body3, conclusion].join("\n\n");
}

export default function AiEssayWriter() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("Expository");
  const [level, setLevel] = useState("College");
  const [wordTarget, setWordTarget] = useState("medium");
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setEssay(generateEssay({ topic, type, level, wordTarget }));
    setLoading(false);
  };

  const copyEssay = async () => {
    if (!essay) return;
    await navigator.clipboard.writeText(essay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = essay ? essay.trim().split(/\s+/).length : 0;

  return (
    <>
      <Seo page="aiEssayWriter" />

      <ToolHeroShell
        icon={FileText}
        title="AI Essay Writer"
        subtitle="Generate structured essay drafts by topic, essay type, and academic level."
        category="social-media-tools"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="essay-topic">
              Essay Topic
            </label>
            <input
              id="essay-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The impact of remote work on productivity"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Essay Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClass}
              >
                {TYPES.map((t) => (
                  <option key={t} className="bg-slate-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={inputClass}
              >
                {LEVELS.map((l) => (
                  <option key={l} className="bg-slate-900 text-white">
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Length</label>
              <select
                value={wordTarget}
                onChange={(e) => setWordTarget(e.target.value)}
                className={inputClass}
              >
                <option value="medium" className="bg-slate-900 text-white">
                  Medium
                </option>
                <option value="long" className="bg-slate-900 text-white">
                  Long
                </option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Writing..." : "Generate Essay"}
          </button>
        </div>

        {essay && (
          <div className="relative mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <FileText className="h-4 w-4" /> Essay Draft ({wordCount} words)
              </h2>
              <button
                type="button"
                onClick={copyEssay}
                className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">{essay}</pre>
            <p className="mt-3 text-xs text-slate-500">
              Use this as a draft starting point. Review, cite sources, and rewrite in your own voice before submission.
            </p>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="social-media-tools"
        currentToolPath="/social-media-tools/ai-essay-writer" />
    </>
  );
}
