import { useMemo, useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Food & Beverage",
  "Creative Agency",
  "Real Estate",
];

const STYLES = [
  "Minimal",
  "Geometric",
  "Wordmark",
  "Emblem",
  "Abstract",
  "Monogram",
];

const MOODS = [
  "Professional",
  "Friendly",
  "Bold",
  "Luxury",
  "Playful",
  "Trustworthy",
];

function buildLogoPrompt({ brand, industry, style, mood }) {
  const name = brand.trim() || "Brand Name";
  const ind = industry || "general business";
  const st = style.toLowerCase();
  const md = mood.toLowerCase();

  return [
    `Design a ${st} logo for "${name}", a ${ind.toLowerCase()} brand.`,
    `Mood: ${md}.`,
    `Primary color: deep ink #07101f. Accent color: teal #0d9488.`,
    `Clean vector-style mark on white background, scalable, no gradients unless subtle.`,
    `Avoid clutter; prioritize legibility at small sizes (favicon-friendly).`,
    `Deliver a flat, modern logo concept suitable for web and print.`,
  ].join(" ");
}

export default function AiLogoGenerator() {
  const [brand, setBrand] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [mood, setMood] = useState(MOODS[0]);
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(
    () => buildLogoPrompt({ brand, industry, style, mood }),
    [brand, industry, style, mood]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

  return (
    <>
      <Seo page="aiLogoGenerator" />

      <ToolHeroShell
        icon={Sparkles}
        title="AI Logo Prompt Generator"
        subtitle="Describe your brand and get a ready-to-use AI logo prompt with brand ink and teal accent colors."
        category="image-tools"
        layout="stack"
        formLabel="Build prompt"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="logo-brand" className={labelClass}>
              Brand name
            </label>
            <input
              id="logo-brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Acme Studio"
              className={inputDark}
            />
          </div>

          <div>
            <label htmlFor="logo-industry" className={labelClass}>
              Industry
            </label>
            <select
              id="logo-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={selectDark}
            >
              {INDUSTRIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="logo-style" className={labelClass}>
              Style
            </label>
            <select
              id="logo-style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className={selectDark}
            >
              {STYLES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="logo-mood" className={labelClass}>
              Mood
            </label>
            <select
              id="logo-mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className={selectDark}
            >
              {MOODS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="logo-prompt" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              Generated prompt
            </label>
            <button type="button" onClick={handleCopy} className="age-btn-ghost px-3 py-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy prompt"}
            </button>
          </div>
          <textarea
            id="logo-prompt"
            readOnly
            rows={6}
            value={prompt}
            className={textareaDark}
          />
          <p className="mt-2 text-xs text-[var(--ftp-ink-soft)]">
            Client-side only. Paste this prompt into your preferred AI image tool. Colors referenced: #07101f and #0d9488.
          </p>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/ai-logo-generator"
      />
    </>
  );
}
