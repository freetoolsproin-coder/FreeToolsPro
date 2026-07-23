import { useState } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import { checkPlagiarism } from "../../services/plagiarismApi";
import { Check, Trash2, Loader2, ShieldCheck, Sparkles, Code2 } from "lucide-react";

export default function PlagiarismChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const WORD_LIMIT = 1000;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleCheck = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await checkPlagiarism(text);
      if (res.error) {
        setResult({ score: 0, unique: 0, words: wordCount, message: res.error });
      } else {
        setResult(res);
      }
    } catch (error) {
      console.error("Error scanning text:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
  };

  return (
    <>
      <Seo page="plagiarismChecker" />

      <ToolHeroShell
        category="developer-tools"
        icon={Code2}
        title="Plagiarism Checker Demo"
        subtitle="Illustrative random originality scores for UI practice—not a real web plagiarism scan."
        formLabel="Start here"
      >
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          This tool does <strong>not</strong> check the web or academic databases. Scores are random
          demos only. For real checks, use a dedicated plagiarism service.
        </div>
        <div className="bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="relative">
              <textarea
                className="w-full textAreaHeight min-h-[260px] p-4 text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y transition dynamic-input text-base outline-none"
                placeholder="Paste sample text to see a demo report (Minimum 10 words)..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
              />

              <div className="absolute bottom-3 right-4 flex items-center gap-4 text-xs font-medium text-slate-400 pointer-events-none">
                <span>{text.length} characters</span>
                <span className={wordCount > WORD_LIMIT ? "text-red-500 font-bold" : ""}>
                  {wordCount} / {WORD_LIMIT} words
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
              <button
                onClick={handleClear}
                disabled={!text || loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black hover:bg-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} /> Clear Text
              </button>

              <button
                onClick={handleCheck}
                disabled={!text.trim() || wordCount > WORD_LIMIT || loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm btnRegular rounded-lg shadow-sm transition mr-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Running demo…
                  </>
                ) : (
                  <>
                    <Check size={16} /> Run demo score
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8 animate-fadeIn">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-500" /> Demo report (illustrative only)
              </h3>

              <div className="w-full bg-slate-200 rounded-full h-3 mb-6 overflow-hidden flex">
                <div
                  className="bg-red-500 h-full transition-all duration-500"
                  style={{ width: `${result.score}%` }}
                />
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${result.unique}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Demo “similar”
                  </span>
                  <span className="text-2xl font-black text-red-500 mt-1 block">{result.score}%</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Demo “unique”
                  </span>
                  <span className="text-2xl font-black text-emerald-500 mt-1 block">
                    {result.unique}%
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Words
                  </span>
                  <span className="text-2xl font-black text-slate-700 mt-1 block">
                    {result.words || wordCount}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <ShieldCheck size={20} className="text-teal-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Important</h4>
                  <p className="text-sm text-slate-600 mt-0.5">{result.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/plagiarism-checker"
      />
    </>
  );
}
