import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";


export default function LlmReadinessChecker() {
  const [text, setText] = useState("");
  const report = useMemo(() => {
    const t = text.trim();
    if (!t) return null;
    const words = t.split(/\s+/).filter(Boolean).length;
    const hasHeading = /^#+\s|\n[A-Z][^\n]{8,}$/m.test(t) || t.split("\n").some((l) => l.length < 60 && /:$/.test(l.trim()));
    const hasList = /(^|\n)\s*([-|*]|\d+\.)\s+/.test(t);
    const hasQuestion = /\?/.test(t);
    const hasUrl = /https?:\/\//i.test(t);
    const hasEntity = /\b(India|API|React|Google|FreeToolsPro|₹|%[a-zA-Z]+)\b/.test(t);
    const avgLen = words ? t.length / Math.max(1, t.split(/[.!?]+/).filter(Boolean).length) : 0;
    let score = 20;
    if (words >= 120) score += 15;
    if (words >= 300) score += 10;
    if (hasHeading) score += 15;
    if (hasList) score += 15;
    if (hasQuestion) score += 10;
    if (hasUrl) score += 10;
    if (hasEntity) score += 10;
    if (avgLen > 40 && avgLen < 220) score += 5;
    score = Math.min(100, score);
    const tips = [];
    if (words < 120) tips.push("Add more explanatory depth (120+ words helps answer engines).");
    if (!hasHeading) tips.push("Add clear section headings that mirror real questions.");
    if (!hasList) tips.push("Use bullets or numbered steps for procedures.");
    if (!hasUrl) tips.push("Cite a primary source URL where you claim facts.");
    if (!hasEntity) tips.push("Name concrete entities (products, places, standards) models can ground on.");
    if (!tips.length) tips.push("Solid structure—keep the first screen answering the core query.");
    return { score, tips, words };
  }, [text]);

  return (
    <>
      <Seo page="llmReadinessChecker" />
      <ToolHeroShell
        category="developer-tools"
        icon={Sparkles}
        title="LLM-Readiness Suggestions"
        subtitle="Score content for AI/answer-engine readiness: entities, structure, citations, and clarity."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <label className="block text-sm text-[var(--ftp-ink-soft)]">Paste page or article draft
          <textarea className={`${inputDark} mt-1.5 min-h-[180px] font-sans`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste content to score for LLM / GEO readiness…" />
        </label>
        {report ? (
          <div className="mt-6 rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-5">
            <p className="text-sm font-semibold text-[var(--ftp-ink)]">Readiness score: {report.score}/100 · {report.words} words</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--ftp-ink-soft)]">
              {report.tips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Heuristic checklist for answer-engine / GEO hygiene—not a ranking guarantee.</p>
        )}

      </ToolHeroShell>
      <ToolContentLayout category="developer-tools" currentToolPath="/developer-tools/llm-readiness-checker" />
    </>
  );
}
