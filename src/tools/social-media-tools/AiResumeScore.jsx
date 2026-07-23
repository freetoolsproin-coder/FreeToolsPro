import { useMemo, useState } from "react";
import { FileUser, BarChart3, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

const ACTION_VERBS = [
  "achieved", "built", "created", "delivered", "designed", "developed", "drove", "enhanced",
  "executed", "generated", "grew", "implemented", "improved", "increased", "launched", "led",
  "managed", "optimized", "organized", "produced", "reduced", "resolved", "scaled", "streamlined",
];

const KEYWORDS = [
  "experience", "skills", "education", "summary", "project", "certification", "achievement",
  "responsibilities", "results", "leadership", "communication", "team", "analytics", "strategy",
];

function scoreResume(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = trimmed.toLowerCase();

  const foundKeywords = KEYWORDS.filter((k) => lower.includes(k));
  const keywordScore = Math.min(30, Math.round((foundKeywords.length / 8) * 30));

  const foundVerbs = ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, "i").test(trimmed));
  const verbScore = Math.min(35, foundVerbs.length * 5);

  let lengthScore = 0;
  let lengthFeedback = "";
  if (wordCount < 150) {
    lengthScore = Math.round((wordCount / 150) * 15);
    lengthFeedback = `Resume is short (${wordCount} words). Aim for 250–600 words with measurable achievements.`;
  } else if (wordCount <= 700) {
    lengthScore = 25;
    lengthFeedback = `Good length (${wordCount} words). Enough detail for recruiters to scan quickly.`;
  } else if (wordCount <= 1000) {
    lengthScore = 18;
    lengthFeedback = `Slightly long (${wordCount} words). Trim less relevant details for a tighter one-page feel.`;
  } else {
    lengthScore = 10;
    lengthFeedback = `Too long (${wordCount} words). Focus on recent, high-impact experience only.`;
  }

  const hasSections = /(experience|education|skills|summary)/i.test(trimmed);
  const structureScore = hasSections ? 10 : 4;

  const total = Math.min(100, keywordScore + verbScore + lengthScore + structureScore);

  return {
    score: total,
    wordCount,
    feedback: {
      keywords: {
        score: keywordScore,
        found: foundKeywords,
        message:
          foundKeywords.length >= 6
            ? `Strong keyword coverage (${foundKeywords.length} found).`
            : `Add more section keywords like skills, experience, and achievements (${foundKeywords.length} found).`,
      },
      actionVerbs: {
        score: verbScore,
        found: foundVerbs,
        message:
          foundVerbs.length >= 5
            ? `Excellent use of action verbs (${foundVerbs.length} detected).`
            : `Use more action verbs such as led, developed, improved (${foundVerbs.length} detected).`,
      },
      length: {
        score: lengthScore,
        message: lengthFeedback,
      },
      structure: {
        score: structureScore,
        message: hasSections
          ? "Resume includes recognizable section keywords."
          : "Add clear section headings: Summary, Experience, Skills, Education.",
      },
    },
  };
}

function scoreColor(score) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

export default function AiResumeScore() {
  const [resume, setResume] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const result = useMemo(() => {
    if (!analyzed) return null;
    return scoreResume(resume);
  }, [resume, analyzed]);

  const handleAnalyze = () => {
    if (!resume.trim()) return;
    setAnalyzed(true);
  };

  return (
    <>
      <Seo page="aiResumeScore" />

      <ToolHeroShell
        icon={FileUser}
        title="AI Resume Score"
        subtitle="Paste your resume text and get a 0–100 score with keyword, length, and action-verb feedback."
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="resume-score-input">
              Resume Text
            </label>
            <textarea
              id="resume-score-input"
              rows={10}
              value={resume}
              onChange={(e) => {
                setResume(e.target.value);
                setAnalyzed(false);
              }}
              placeholder="Paste your resume content here..."
              className={textareaDark}
            />
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!resume.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <BarChart3 className="h-4 w-4" />
            Score Resume
          </button>

          {result && (
            <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">Resume Score</h2>
                <span className={`text-4xl font-bold ${scoreColor(result.score)}`}>{result.score}/100</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Keywords", data: result.feedback.keywords },
                  { label: "Action Verbs", data: result.feedback.actionVerbs },
                  { label: "Length", data: result.feedback.length },
                  { label: "Structure", data: result.feedback.structure },
                ].map(({ label, data }) => (
                  <div key={label} className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-200">{label}</p>
                      <span className="text-sm text-sky-300">{data.score} pts</span>
                    </div>
                    <p className="text-sm text-slate-400">{data.message}</p>
                    {data.found?.length > 0 && (
                      <p className="mt-2 text-xs text-slate-500">
                        Found: {data.found.slice(0, 8).join(", ")}
                        {data.found.length > 8 ? "…" : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setAnalyzed(false)}
                className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-slate-200"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Edit and re-score
              </button>
            </div>
          )}
        </div>
      </ToolHeroShell>

      <ToolPageContent category="social-media-tools" currentToolPath="/social-media-tools/ai-resume-score" />
    </>
  );
}
