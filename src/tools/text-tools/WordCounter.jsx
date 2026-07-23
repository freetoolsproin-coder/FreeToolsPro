import React, { useState } from "react";
import { FileText, Type, WholeWord, Book, Copy, Trash2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = text.split(/\n+/).filter(Boolean).length;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setText("");
  };

  const stats = {
    Words: { value: wordCount, icon: <WholeWord className="h-4 w-4" /> },
    Characters: { value: charCount, icon: <Type className="h-4 w-4" /> },
    Sentences: { value: sentenceCount, icon: <FileText className="h-4 w-4" /> },
    Paragraphs: { value: paragraphCount, icon: <Book className="h-4 w-4" /> },
  };

  return (
    <>
      <Seo page="wordCounter" />

      <ToolHeroShell
        icon={FileText}
        title="Word Counter"
        subtitle="Analyze your text — count words, characters, sentences, and paragraphs in real time"
      >
        <label className="block text-sm font-medium text-slate-300" htmlFor="text-input">
          Enter or paste your text below
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className={`${textareaDark} mt-2 h-48`}
        />
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy Text"}
          </button>
          <button
            type="button"
            onClick={clearText}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
            Clear Text
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(stats).map(([label, { value, icon }]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                {icon}
                {label}
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </ToolHeroShell>

      <ToolPageContent category="text-tools" currentToolPath="/text-tools/word-counter" />
    </>
  );
}
