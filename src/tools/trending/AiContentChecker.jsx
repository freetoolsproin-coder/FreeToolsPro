import { useState, useTransition } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import { Copy, Check, Trash2, ShieldAlert, Sparkles, FileText, Clock } from "lucide-react";

export default function AiContentDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
  };

  const analyzeText = () => {
    if (!text.trim()) return;

    startTransition(() => {
      // Clean paragraphs and extract sentences cleanly
      const rawSentences = text
        .split(/[.!?\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const words = text.trim().split(/\s+/).filter(Boolean);

      if (words.length < 5) {
        alert("Please enter at least 5 words for a reliable analysis.");
        return;
      }

      const wordLengths = words.map((w) => w.length);
      const avgWordLength = wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length;

      const sentenceLengths = rawSentences.map((s) => s.split(/\s+/).filter(Boolean).length);
      const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;

      // Variance & Burstiness (Human writing has high variance/burstiness)
      const variance =
        sentenceLengths.reduce((acc, val) => acc + Math.pow(val - avgSentenceLength, 2), 0) /
        sentenceLengths.length;
      const burstiness = Math.sqrt(variance);

      // Advanced analysis simulation: High predictability (Perplexity)
      // LLMs use highly uniform transitions. We evaluate vocabulary variety vs length.
      const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^\w]/g, "")));
      const lexicalDiversity = uniqueWords.size / words.length;

      // Process each sentence individually to flag specific AI-suspect segments
      const analyzedSentences = rawSentences.map((sentence) => {
        const sWords = sentence.split(/\s+/).filter(Boolean);
        let penalty = 0;

        // AI tends to write consistently structured middle-long sentences
        if (sWords.length >= 12 && sWords.length <= 22) penalty += 35;
        // Lack of structural deviation
        if (Math.abs(sWords.length - avgSentenceLength) < 3) penalty += 25;
        // Common AI transitional padding sequences
        if (
          /^(moreover|furthermore|in conclusion|notably|it is important|essential to|crucial to|delve|testament)/i.test(
            sentence
          )
        )
          penalty += 30;

        return {
          text: sentence,
          aiProbability: Math.min(penalty, 100),
        };
      });

      // Assemble final macro AI score
      let aiScore = 40; // Base baseline structural baseline

      // Adjust based on structural signals
      if (burstiness < 4) aiScore += 25; // Monotonous sentence structures
      if (burstiness > 8) aiScore -= 20; // Highly erratic dynamic human transitions
      if (lexicalDiversity < 0.45) aiScore += 15; // Repetitive machine vocabulary choice
      if (avgSentenceLength > 15 && avgSentenceLength < 22) aiScore += 15; // Classic AI sweet-spot sentence lengths

      // Boundary clamp
      aiScore = Math.max(10, Math.min(aiScore, 98));

      // Estimated breakdown metrics
      const readingTime = Math.ceil(words.length / 225);

      setResult({
        aiProbability: Math.round(aiScore),
        humanProbability: 100 - Math.round(aiScore),
        avgSentenceLength: avgSentenceLength.toFixed(1),
        burstiness: burstiness.toFixed(1),
        sentenceCount: rawSentences.length,
        wordCount: words.length,
        lexicalDiversity: Math.round(lexicalDiversity * 100),
        readingTime,
        analyzedSentences,
      });
    });
  };

  const getScoreColor = (score) => {
    if (score < 35) return "bg-green-500 text-green-500";
    if (score < 70) return "bg-yellow-500 text-yellow-500";
    return "bg-red-500 text-red-500";
  };

  return (
    <>
      <Seo page="aiContentDetector" />

      <ToolHeroShell
        category="trending-tools"
        icon={Sparkles}
        title="AI Content Detector"
        subtitle="Analyze structural distribution, lexical diversity, and burstiness signatures to catch AI-generated text."
        formLabel="Analyze"
        layout="stack"
        wide
      >
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Side: Input Workspace */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-slate-800">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center text-xs text-gray-500">
                <span className="font-mono">Real-time Sandbox ({text.length} chars)</span>
                <div className="flex gap-4">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 hover:text-teal-700 transition"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}{" "}
                    Copy
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1 hover:text-red-600 transition"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>

              <textarea
                className="w-full jsonTextarea p-4 border-none focus:ring-0 focus:outline-none resize-none text-gray-800 placeholder-gray-400 font-normal"
                rows="12"
                placeholder="Paste your essay, article, or copy here to run predictive modeling scans..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText size={14} /> {text.trim() ? text.trim().split(/\s+/).length : 0} Words
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> ~
                    {Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 225)} min read
                  </span>
                </div>
                <button
                  onClick={analyzeText}
                  disabled={isPending || !text.trim()}
                  className="px-5 py-2.5 btnRegular text-white font-medium rounded-xl text-sm shadow hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPending ? "Analyzing..." : "Analyze Scan"}
                </button>
              </div>
            </div>

            {/* Right Side: Analysis Performance Metrics Panel */}
            <div className="lg:col-span-1">
              {!result && !isPending && (
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-400 flex flex-col items-center justify-center h-64">
                  <ShieldAlert size={36} className="mb-2 text-gray-300" />
                  <p className="text-sm font-medium">Ready for deep scan analysis</p>
                  <p className="text-xs mt-1">Submit text to view classification metrics.</p>
                </div>
              )}

              {isPending && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-500 space-y-3 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                  <div className="h-12 bg-gray-200 rounded-full w-24 mx-auto my-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
                  </div>
                </div>
              )}

              {result && !isPending && (
                <div className="space-y-6">
                  {/* Score Summary Block */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                      Verdict Meter
                    </h3>

                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                        AI Score Signature
                      </span>
                      <span
                        className={`text-2xl font-black ${getScoreColor(result.aiProbability).split(" ")[1]}`}
                      >
                        {result.aiProbability}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-6">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getScoreColor(result.aiProbability).split(" ")[0]}`}
                        style={{ width: `${result.aiProbability}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-100 pt-4">
                      <div>
                        <div className="text-xs text-gray-400">Human Content</div>
                        <div className="text-lg font-bold text-gray-800">
                          {result.humanProbability}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Lexical Variety</div>
                        <div className="text-lg font-bold text-gray-800">
                          {result.lexicalDiversity}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Linguistic Statistics Details */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                      Structural Fingerprint
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-500">Sentences Tracked</span>
                        <span className="font-semibold text-gray-800">{result.sentenceCount}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-500">Avg Sentence Length</span>
                        <span className="font-semibold text-gray-800">
                          {result.avgSentenceLength} words
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500 flex items-center gap-1">
                          Burstiness Index
                        </span>
                        <span className="font-semibold text-gray-800">{result.burstiness}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Sentence Highlight Deep-Dive Segment */}
          {result && !isPending && (
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
                🔍 Per-Sentence Risk Highlighter
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Sentences highlighted in{" "}
                <span className="bg-red-100 px-1 rounded text-red-700 font-semibold">
                  red/orange
                </span>{" "}
                exhibit fixed token distributions common in generative AI text layers.
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 leading-relaxed text-gray-700 text-sm">
                {result.analyzedSentences.map((item, index) => {
                  let highlightClass = "";
                  if (item.aiProbability > 50)
                    highlightClass = "bg-red-100 text-red-900 border-b border-red-300";
                  else if (item.aiProbability > 25)
                    highlightClass = "bg-yellow-100 text-yellow-900 border-b border-yellow-300";

                  return (
                    <span
                      key={index}
                      className={`inline-block mr-1.5 px-0.5 rounded transition ${highlightClass}`}
                      title={`Predictability Risk: ${item.aiProbability}%`}
                    >
                      {item.text}.
                    </span>
                  );
                })}
              </div>
            </div>
          )}
      </ToolHeroShell>

      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/ai-content-checker" />
    </>
  );
}
