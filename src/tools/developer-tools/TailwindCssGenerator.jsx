import { useMemo, useState } from "react";
import { Wind, Copy, Check, Sparkles } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { selectDark } from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

const SPACING_OPTIONS = [
  { value: "", label: "None" },
  { value: "0", label: "0" },
  { value: "1", label: "1 (0.25rem)" },
  { value: "2", label: "2 (0.5rem)" },
  { value: "3", label: "3 (0.75rem)" },
  { value: "4", label: "4 (1rem)" },
  { value: "6", label: "6 (1.5rem)" },
  { value: "8", label: "8 (2rem)" },
  { value: "12", label: "12 (3rem)" },
];

const COLOR_OPTIONS = [
  { value: "", label: "None" },
  { value: "slate", label: "Slate" },
  { value: "gray", label: "Gray" },
  { value: "sky", label: "Sky" },
  { value: "blue", label: "Blue" },
  { value: "emerald", label: "Emerald" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
  { value: "violet", label: "Violet" },
];

const ROUNDED_OPTIONS = [
  { value: "", label: "None" },
  { value: "rounded-none", label: "None (rounded-none)" },
  { value: "rounded-sm", label: "Small" },
  { value: "rounded", label: "Default" },
  { value: "rounded-md", label: "Medium" },
  { value: "rounded-lg", label: "Large" },
  { value: "rounded-xl", label: "XL" },
  { value: "rounded-2xl", label: "2XL" },
  { value: "rounded-full", label: "Full" },
];

const SHADOW_OPTIONS = [
  { value: "", label: "None" },
  { value: "shadow-sm", label: "Small" },
  { value: "shadow", label: "Default" },
  { value: "shadow-md", label: "Medium" },
  { value: "shadow-lg", label: "Large" },
  { value: "shadow-xl", label: "XL" },
  { value: "shadow-2xl", label: "2XL" },
];

export default function TailwindCssGenerator() {
  const [padding, setPadding] = useState("4");
  const [margin, setMargin] = useState("");
  const [bgColor, setBgColor] = useState("sky");
  const [textColor, setTextColor] = useState("");
  const [rounded, setRounded] = useState("rounded-lg");
  const [shadow, setShadow] = useState("shadow-md");
  const [copied, setCopied] = useState(false);

  const classString = useMemo(() => {
    const parts = [];
    if (padding) parts.push(`p-${padding}`);
    if (margin) parts.push(`m-${margin}`);
    if (bgColor) parts.push(`bg-${bgColor}-500`);
    if (textColor) parts.push(`text-${textColor}-700`);
    if (rounded) parts.push(rounded);
    if (shadow) parts.push(shadow);
    return parts.join(" ") || "(select options above)";
  }, [padding, margin, bgColor, textColor, rounded, shadow]);

  const handleCopy = async () => {
    if (!classString || classString.startsWith("(")) return;
    await navigator.clipboard.writeText(classString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labelClass = "mb-1.5 block text-sm font-medium text-slate-300";

  return (
    <>
      <Seo page="tailwindCssGenerator" />
      <ToolHeroShell
        icon={Wind}
        title="Tailwind CSS Class Generator"
        subtitle="Pick spacing, colors, rounded corners, and shadows to build a Tailwind utility string."
        maxWidth="max-w-4xl"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="padding">
              Padding
            </label>
            <select
              id="padding"
              value={padding}
              onChange={(e) => setPadding(e.target.value)}
              className={selectDark}
            >
              {SPACING_OPTIONS.map((o) => (
                <option key={`p-${o.value}`} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="margin">
              Margin
            </label>
            <select
              id="margin"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              className={selectDark}
            >
              {SPACING_OPTIONS.map((o) => (
                <option key={`m-${o.value}`} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="bg">
              Background Color
            </label>
            <select
              id="bg"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className={selectDark}
            >
              {COLOR_OPTIONS.map((o) => (
                <option key={`bg-${o.value}`} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="text">
              Text Color
            </label>
            <select
              id="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className={selectDark}
            >
              {COLOR_OPTIONS.map((o) => (
                <option key={`text-${o.value}`} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="rounded">
              Border Radius
            </label>
            <select
              id="rounded"
              value={rounded}
              onChange={(e) => setRounded(e.target.value)}
              className={selectDark}
            >
              {ROUNDED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="shadow">
              Box Shadow
            </label>
            <select
              id="shadow"
              value={shadow}
              onChange={(e) => setShadow(e.target.value)}
              className={selectDark}
            >
              {SHADOW_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span className="text-sm font-medium text-slate-300">Generated Classes</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!classString || classString.startsWith("(")}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-sky-400 disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="mt-2 break-all font-mono text-lg text-emerald-300">{classString}</p>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm text-slate-400">Live preview</p>
          <div
            className={`inline-block ${classString.startsWith("(") ? "p-4 bg-slate-800 rounded" : classString} text-white`}
          >
            Preview element
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="developer-tools"
        currentToolPath="/developer-tools/tailwind-css-generator" />
    </>
  );
}
