import React, { useState, useEffect, useCallback } from "react";
import { Copy, RefreshCw, AlignLeft } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark, textareaDark } from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

const MIN_COUNT = 1;
const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
  "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
  "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
  "mollit", "anim", "id", "est", "laborum",
];

function pickWords(count) {
  const result = [];
  for (let i = 0; i < count; i += 1) {
    result.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return result;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function makeSentence() {
  const length = Math.floor(Math.random() * 8) + 6;
  return `${capitalize(pickWords(length).join(" "))}.`;
}

function makeParagraph() {
  const sentences = Math.floor(Math.random() * 3) + 3;
  return Array.from({ length: sentences }, makeSentence).join(" ");
}

function generateLorem(count, type) {
  if (type === "words") {
    return `${capitalize(pickWords(count).join(" "))}.`;
  }
  if (type === "sentences") {
    return Array.from({ length: count }, makeSentence).join(" ");
  }
  return Array.from({ length: count }, makeParagraph).join("\n\n");
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState("paragraphs");
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const numCount = parseInt(count, 10);
    if (isNaN(numCount) || numCount < MIN_COUNT) {
      return;
    }
    setGeneratedText(generateLorem(numCount, type));
  }, [count, type]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [generatedText]);

  useEffect(() => {
    handleGenerate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Seo page="loremIpsumGenerator" />

      <ToolHeroShell
        icon={AlignLeft}
        title="Lorem Ipsum Generator"
        subtitle="Generate placeholder text for design mockups, layouts, and prototypes"
      >
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[120px] flex-grow">
            <label htmlFor="count" className="block text-sm font-medium text-slate-300">
              Count
            </label>
            <input
              type="number"
              id="count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className={`${inputDark} mt-2`}
              min={MIN_COUNT}
            />
          </div>
          <div className="min-w-[160px] flex-grow">
            <label htmlFor="type" className="block text-sm font-medium text-slate-300">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${selectDark} mt-2`}
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 self-end rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" /> Generate
          </button>
        </div>

        <div className="relative mt-4">
          <textarea
            value={generatedText}
            readOnly
            className={`${textareaDark} h-64`}
            placeholder="Generated text will appear here..."
          />
          {generatedText && (
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="text-tools"
        currentToolPath="/text-tools/lorem-ipsum-generator" />
    </>
  );
}
