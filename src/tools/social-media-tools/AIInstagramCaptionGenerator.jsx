import React, { useState } from "react";
import { Copy, Wand2, Check, Hash, Sparkles } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

const toneTemplates = {
  trendy: [
    "Living my best life with {keyword} ✨",
    "{keyword} vibes only 😎",
    "Main character energy featuring {keyword} 🎬",
    "Not your average {keyword} post 💅",
  ],
  funny: [
    "I followed my heart and it led me to {keyword} 🤷‍♂️",
    "Perfecting the art of {keyword} so you don't have to 🦉",
    "Relationship status: deeply committed to {keyword} 😂",
    "They said don't try this at home, so I went out and did {keyword} 🚶‍♂️",
  ],
  aesthetic: [
    "Moments like this with {keyword} 💫",
    "Soft hours spent with {keyword} ☁️",
    "Finding the poetry in {keyword} 🪐",
    "Chasing shadows and {keyword} 🌾",
  ],
  professional: [
    "Maximizing efficiency and results through {keyword} 📈",
    "Excited to share our latest insights on {keyword} 💡",
    "Building the future, one step at a time with {keyword} 💼",
    "Why {keyword} remains a core element of modern strategy 🔑",
  ],
  minimalist: [
    "Just {keyword}.",
    "Focusing on {keyword} 🙌",
    "Simply {keyword} 🌍",
    "Less talk, more {keyword} 🌱",
  ],
  motivational: [
    "Happiness starts with {keyword} 🌸",
    "Stay real, stay {keyword} 💯",
    "Consistency turns {keyword} into success 🔥",
    "Don't wish for it. Work for {keyword} 💪",
  ],
};

const hashtagsPool = [
  "#instagood",
  "#photooftheday",
  "#love",
  "#instadaily",
  "#explore",
  "#trending",
  "#viral",
  "#instagram",
  "#reels",
  "#follow",
  "#lifestyle",
  "#picoftheday",
  "#mood",
  "#vibes",
  "#goals",
  "#blessed",
];

export default function InstaCaptionTool() {
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState("trendy");
  const [hashtagCount, setHashtagCount] = useState(5);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCaption = () => {
    if (!keyword.trim()) {
      alert("Please enter a keyword or topic!");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation delay for realistic user experience
    setTimeout(() => {
      const selectedToneTemplates = toneTemplates[tone] || toneTemplates.trendy;
      const randomTemplate =
        selectedToneTemplates[Math.floor(Math.random() * selectedToneTemplates.length)];

      let captionText = randomTemplate.replace(/{keyword}/g, keyword);

      // Strip emojis if user turned them off
      if (!includeEmojis) {
        captionText = captionText
          .replace(
            /[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g,
            ""
          )
          .trim();
      }

      // Generate context hashtags + generic ones
      const cleanKeyword = keyword.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      let localPool = [...hashtagsPool];
      if (cleanKeyword) {
        localPool.unshift(`#${cleanKeyword}`);
      }

      const shuffled = localPool.sort(() => 0.5 - Math.random());
      const selectedTags = shuffled.slice(0, Number(hashtagCount)).join(" ");

      const finalCaption = selectedTags ? `${captionText}\n\n${selectedTags}` : captionText;

      setResult(finalCaption);
      setIsGenerating(false);
      setCopied(false);
    }, 600);
  };

  const copyText = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="aiInstagramCaptionGenerator" />

      <ToolHeroShell
        category="social-media-tools"
        icon={Sparkles}
        title="AI Instagram Caption Generator"
        subtitle="Create highly engaging, targeted captions with smart hashtags instantly."
        formLabel="Start here"
      >
<div className="bg-white rounded-3xl p-6 md:p-8 mt-4 shadow-sm border border-gray-100">
            {/* Input Field */}
            <div className="mb-6">
              <label className="block text-xs font-normal text-gray-700 mb-2">
                What is your post about?
              </label>
              <input
                type="text"
                placeholder="e.g., morning coffee, weekend trip, gym workout, graduation..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Advanced Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-normal text-gray-700 mb-2">Caption Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition capitalize"
                >
                  {Object.keys(toneTemplates).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hashtag Count Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Hash size={16} /> Number of Hashtags
                  </label>
                  <span className="text-1xl font-bold text-black">{hashtagCount}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={hashtagCount}
                  onChange={(e) => setHashtagCount(e.target.value)}
                  className="w-full inputSlider accent-purple-600 cursor-pointer h-2 mt-6 bg-gray-200 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Formatting Toggles */}
            <div className="flex items-center mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeEmojis}
                  onChange={(e) => setIncludeEmojis(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300 accent-purple-600"
                />
                <span className="text-sm text-gray-700 font-medium">Include Emojis 😍</span>
              </label>
            </div>

            {/* Action Button */}
            <button
              onClick={generateCaption}
              disabled={isGenerating}
              className={`w-full py-3 px-4 mx-auto text-white font-semibold rounded-xl flex justify-center items-center gap-2 transition shadow-md ${
                isGenerating
                  ? "btnRegular cursor-not-allowed"
                  : "btnRegular hover:bg-purple-700 active:scale-[0.99]"
              }`}
            >
              <Wand2 size={18} className={isGenerating ? "animate-spin" : ""} />
              {isGenerating ? "AI is crafting your caption..." : "Generate Advanced Caption"}
            </button>

            {/* Output Result Box */}
            {result && (
              <div className="mt-6 border bg-gray-200 rounded-2xl p-5 relative">
                <span className="text-xs uppercase tracking-wider font-bold text-purple-500 block mb-2">
                  Generated Result
                </span>
                <p className="whitespace-pre-line text-gray-800 text-base pr-10 leading-relaxed">
                  {result}
                </p>

                <button
                  onClick={copyText}
                  title="Copy to clipboard"
                  className={`absolute top-4 right-4 p-2 rounded-lg transition border ${
                    copied
                      ? "bg-green-100 border-green-200 text-green-700"
                      : "bg-white border-gray-200 text-gray-500 hover:text-purple-600 shadow-sm"
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            )}
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/ai-instagram-caption-generator" />
    </>
  );
}
