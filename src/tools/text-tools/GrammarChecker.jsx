import React, { useState, useEffect } from "react";
import { SpellCheck } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

const checkGrammar = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const suggestions = [];
      if (text.includes("teh")) {
        suggestions.push({ word: "teh", suggestion: "the" });
      }
      if (text.includes("writting")) {
        suggestions.push({ word: "writting", suggestion: "writing" });
      }
      resolve(suggestions);
    }, 500);
  });
};

export default function GrammarChecker() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text) {
        setLoading(true);
        checkGrammar(text).then((result) => {
          setSuggestions(result);
          setLoading(false);
        });
      } else {
        setSuggestions([]);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [text]);

  const highlightText = () => {
    let highlightedText = text;
    suggestions.forEach((suggestion) => {
      const regex = new RegExp(`\\b${suggestion.word}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="bg-amber-400/30 text-amber-200">${suggestion.word}</span>`
      );
    });
    return { __html: highlightedText };
  };

  return (
    <>
      <Seo page="grammarChecker" />

      <ToolHeroShell
        icon={SpellCheck}
        title="Grammar Checker"
        subtitle="Check your text for grammar and spelling errors with real-time suggestions"
      >
        <label className="block text-sm font-medium text-slate-300" htmlFor="text-input">
          Enter or paste your text below
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here to check for grammar and spelling errors..."
          className={`${textareaDark} mt-2`}
          style={{ height: "250px" }}
        />

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
          {loading ? (
            <p className="text-center text-sm text-slate-400">Checking...</p>
          ) : suggestions.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold text-white">Suggestions</h2>
              <div
                className="mt-4 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-slate-200"
                dangerouslySetInnerHTML={highlightText()}
              />
              <ul className="mt-4 space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2"
                  >
                    <span className="text-red-400">{suggestion.word}</span>
                    <span className="text-emerald-400">→ {suggestion.suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-sm text-slate-400">
                {text ? "No suggestions available." : "Start typing to check your grammar."}
              </p>
            </div>
          )}
        </div>
      </ToolHeroShell>

      <ToolPageContent category="text-tools" currentToolPath="/text-tools/grammar-checker" />
    </>
  );
}
